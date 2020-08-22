/** @packageDocumentation @module BattleScene */

import { BattleScene } from "./Engine/ScenePrototypes/BattleScene";
import { Mob } from "./Engine/GameObjects/Mob";
import { MobData } from "./Engine/Core/MobData";
import { CometWand } from "./Weapons/Staff";
import * as PlayerAgents from "./Agents/PlayerAgents";
import { KeepMoving } from "./Agents/SimpleAgents";
import { HealDmg } from "./Engine/Core/Helper";
import { SpellFlags } from "./Engine/GameObjects/Spell";
import { ItemManager } from "./Engine/Core/InventoryCore";
import { ItemList } from "./ItemList";

export class TestScene extends BattleScene
{
    terrainLayer: Phaser.Tilemaps.StaticTilemapLayer;
    tiles: Phaser.Tilemaps.Tileset;
    girl: Mob;

    h: Mob;
    hc: number = 0.5;
    hcM: number = 0.5;

    constructor() 
    {
        super(false); // debug?
    }

    preload() 
    {
        super.preload();
        this.load.image('logo', 'assets/BlueHGRMJsm.png');

        this.load.image('Grass_Overworld', 'assets/tilemaps/tiles/overworld_tileset_grass.png');
        this.load.tilemapTiledJSON('overworld', 'assets/tilemaps/Overworld_tst.json');

        this.load.spritesheet('elf', 'assets/forestElfMyst.png', { frameWidth: 32, frameHeight: 32, endFrame: 3 });

        this.load.json('itemData', 'assets/dataSheets/Items.json');
    }

    create() 
    {
        super.create();

        // Create the ItemManager
        ItemManager.setData(this.cache.json.get('itemData'), ItemList);
        ItemManager.newItem("cometWand");

        this.map = this.make.tilemap({ key: 'overworld' });
        this.tiles = this.map.addTilesetImage('Grass_Overworld', 'Grass_Overworld');
        this.terrainLayer = this.map.createStaticLayer('Terrain', this.tiles, 0, 0);

        this.anims.create({ key: 'move', frames: this.anims.generateFrameNumbers('elf', { start: 0, end: 3, first: 0 }), frameRate: 8, repeat: -1 });

        // this.alive.push(new Mob(this.add.sprite(100, 200, 'elf'), 'move'));
        this.girl = new Mob(this, 100, 200, 'char_sheet_forestelf_myst', {
            'idleAnim': 'move',
            'moveAnim': 'move',
            'deadAnim': 'move',
            'backendData': new MobData({ name: 'testGirl', 'isPlayer': true, 'attackSpeed': 5, 'mag': 5, }),
            'agent': PlayerAgents.Simple,
        });
        this.girl.mobData.battleStats.attackPower.ice = 10;
        this.girl.mobData.battleStats.crit = 50.0;
        this.girl.mobData.weaponRight = new CometWand();
        this.girl.mobData.currentWeapon = this.girl.mobData.weaponRight;
        this.girl.mobData.addListener(this.girl.mobData.weaponRight);
        this.addMob(this.girl);

        let woodlog = new Mob(this, 300, 200, 'char_sheet_forestelf_myst', {
            'idleAnim': 'move',
            'moveAnim': 'move',
            'deadAnim': 'move',
            'backendData': new MobData({ name: 'woodLog', 'isPlayer': false, 'health': 1000, }),
            'agent': KeepMoving,
            // 'agent': undefined,
        });
        this.addMob(woodlog);

        woodlog = new Mob(this, 350, 200, 'char_sheet_forestelf_myst', {
            'idleAnim': 'move',
            'moveAnim': 'move',
            'deadAnim': 'move',
            'backendData': new MobData({ name: 'woodLog', 'isPlayer': false, 'health': 1000, }),
            'agent': KeepMoving,
            // 'agent': undefined,
        });
        this.addMob(woodlog);
        this.h = woodlog;

        woodlog = new Mob(this, 300, 250, 'char_sheet_forestelf_myst', {
            'idleAnim': 'move',
            'moveAnim': 'move',
            'deadAnim': 'move',
            'backendData': new MobData({ name: 'woodLog', 'isPlayer': false, 'health': 1000, }),
            'agent': KeepMoving,
            // 'agent': undefined,
        });
        this.addMob(woodlog);
    }

    update(time: number, dt: number)
    {
        super.update(time, dt);
        // console.log("Mana: " + this.girl.mobData.currentMana.toString() + " / " + this.girl.mobData.maxMana.toString());

        if (this.hc < 0)
        {
            this.hc = this.hcM;
            HealDmg({ 'source': this.h, 'target': this.h, type: 'heal', value: 5 });
        }
        this.hc -= dt * 0.001;
    }
}
