/** @packageDocumentation @module Core */

import { Mob } from "../GameObjects/Mob";
import { mRTypes } from "./mRTypes";
import { UnitManager } from "./UnitManager";
import { Targeting } from "../GameObjects/Spell";
import { GameData } from "./GameData";
import { MobData } from "./MobData";

type AoECBm = (mob: Mob) => void;
type AoECBml = (mob: Mob, list: Mob[]) => void;
type AoECBmli = (mob: Mob, list: Mob[], idx: number) => void

/**
 * Helper function for easily performing Area of Effects (AoE). Currently only supports a circle area.
 * 
 * Example:
 * ```typescript
 * AoE(
 *     (m: Mob, list: Mob[]) =>
 *     {
 *         // In fact it is not good to perform a HealDmg without assigning a source.
 *         HealDmg({'target': m, 'value': 200 / list.length, 'type': 'fire'});
 *     },
 *     new Phaser.Math.Vector2(200, 200),
 *     100,
 *     Targeting.Both
 * );
 * ```
 * Above code will perform a fire type AoE attack, centered at (200, 200) with range 100, dealing a splitable 200 damage (in total) to all targets inside its range.
 * 
 * @param func Callback that will be applied for each mob once, who got captured by this AoE.
 * @param pos Center of this AoE
 * @param range Range of this AoE in px
 * @param targets Which type of mobs is this AoE capturing. Rather player, enemy or both.
 * @param maxCapture Maximum units that this AoE can capture, <= 0 means no limit. It is recommended to set a non-identity compareFunc when a maxCapture number is set.
 * @param compareFunc The compareing function that will be used when quering the captured unit list. If set, target list will be sorted wrt this function, default is Identity (no sort).
 */
export function AoE(
    func: AoECBm | AoECBml | AoECBmli,
    pos: Phaser.Math.Vector2, range: number, targets: Targeting, maxCapture: number = -1, compareFunc: mRTypes.CompareFunc<Mob> = UnitManager.IDENTITY)
{
    AoE_general(func, (a: Mob) => { return (a.footPos().distance(pos) < range); }, targets, maxCapture, compareFunc)
}

/**
 * Same as AoE, but supports arbitrary shape.
 * 
 * @param func Callback that will be applied for each mob once, who got captured by this AoE.
 * @param isIn Function that defines the "shape" of AoE: returns true if target is inside the attack range, otherwise false.
 * @param targets Which type of mobs is this AoE capturing. Rather player, enemy or both.
 * @param maxCapture Maximum units that this AoE can capture, <= 0 means no limit. It is recommended to set a non-identity compareFunc when a maxCapture number is set.
 * @param compareFunc The compareing function that will be used when quering the captured unit list. If set, target list will be sorted wrt this function, default is Identity (no sort).
 */
export function AoE_general(
    func: AoECBm | AoECBml | AoECBmli,
    isIn: mRTypes.FilterFunc<Mob>, targets: Targeting, maxCapture: number = -1, compareFunc: mRTypes.CompareFunc<Mob> = UnitManager.IDENTITY)
{
    let AoEList =
        targets == Targeting.Both ?
            UnitManager.getCurrent().getUnitListAll(
                compareFunc,
                isIn)
            :
            UnitManager.getCurrent().getUnitList(
                compareFunc,
                isIn,
                targets == Targeting.Player);

    if (maxCapture > 0)
    {
        AoEList = AoEList.slice(0, maxCapture);
    }

    AoEList.forEach((m: Mob, i: number, l: Mob[]) => { func(m, l, i); });
}

export function getRandomInt(min: number, max: number): number 
{
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min: number, max: number): number 
{
    return Math.random() * (max - min) + min;
}

export function radian(degree: number): number
{
    return degree / 180.0 * Math.PI;
}

export function reverseTarget(target: Targeting): Targeting
{
    if (target == Targeting.Both) { return Targeting.Both; }
    if (target == Targeting.Player) { return Targeting.Enemy; }
    if (target == Targeting.Enemy) { return Targeting.Player; }
}

export function ColorToStr(color: Phaser.Display.Color): string
{
    return Phaser.Display.Color.RGBToString(color.red, color.green, color.blue);
}

export function getMobDataSafe(mobData: MobData, entry: string[], defaultValue: number, additionalSettings: any): any
{
    if (mobData)
    {
        let len = entry.length;
        let currentObj: any = mobData;
        for (var i = 0; i < len; i++)
        {
            currentObj = currentObj[entry[i]];
            if (!currentObj)
            {
                return defaultValue;
            }
        }
        return currentObj;
    }
    return defaultValue;
}

export namespace Helper
{
    export namespace toolTip
    {
        export function beginSection(): string
        {
            return "<div>";
        }

        export function switchSection(): string
        {
            return "</div><div>";
        }

        export function endSection(): string
        {
            return "</div>";
        }

        export function row(text: string, style?: string, cls?: string): string
        {
            if (typeof cls === 'undefined')
            {
                cls = '_row'
            }

            if (style)
            {
                return "<p class = '" + cls + "' style = '" + style + "'>" + text + "</p>";
            }
            return "<p class = '" + cls + "'>" + text + "</p>";
        }

        export function column(text: string, style?: string): string
        {
            if (style)
            {
                return "<span style = '" + style + "'>" + text + "</span>";
            }
            return "<span>" + text + "</span>";
        }

        export function colored(text: string, color: string, style?: string): string
        {
            if (style)
            {
                return "<strong style='color:" + color + ";" + style + "'>" + text + "</strong>"
            }
            return "<strong style='color:" + color + ";'>" + text + "</strong>"
        }
    }
}
