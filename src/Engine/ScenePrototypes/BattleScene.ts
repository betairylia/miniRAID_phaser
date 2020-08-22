/** @packageDocumentation @module BattleScene */

import * as Events from '../Events/EventSystem'
// import * as Phaser from 'phaser'
import { Mob } from '../GameObjects/Mob'
import { UnitManager } from '../Core/UnitManager';
import { Spell } from '../GameObjects/Spell';

export class BattleScene extends Phaser.Scene 
{
    width: number;
    height: number;

    unitMgr: UnitManager;

    worldGroup: Phaser.Physics.Arcade.Group;
    commonGroup: Phaser.Physics.Arcade.Group;
    fxGroup: Phaser.Physics.Arcade.Group;

    playerGroup: Phaser.Physics.Arcade.Group;
    enemyGroup: Phaser.Physics.Arcade.Group;

    playerTargetingObjectGroup: Phaser.Physics.Arcade.Group;
    enemyTargetingObjectGroup: Phaser.Physics.Arcade.Group;
    everyoneTargetingObjectGroup: Phaser.Physics.Arcade.Group;

    mapToLoad: string;
    map: Phaser.Tilemaps.Tilemap;

    constructor(debug: boolean = false, mapToLoad = "overworld") 
    {
        super({
            key: 'BattleScene',
            physics: {
                default: 'arcade',
                'arcade': {
                    debug: debug,
                }
            }
        });

        this.mapToLoad = mapToLoad;
    }

    preload() 
    {
        this.width = this.sys.game.canvas.width;
        this.height = this.sys.game.canvas.height;

        this.load.tilemapTiledJSON(this.mapToLoad, "assets/tilemaps/Overworld_tst.json");
    }

    addMob(mob: Mob)
    {
        this.add.existing(mob);
        if (mob.mobData.isPlayer)
        {
            this.playerGroup.add(mob);
        }
        else
        {
            this.enemyGroup.add(mob);
        }
    }

    create() 
    {
        UnitManager.resetScene(this);
        this.unitMgr = UnitManager.getCurrent();

        // Create groups
        this.worldGroup = this.physics.add.group();
        this.commonGroup = this.physics.add.group();
        this.fxGroup = this.physics.add.group();
        this.playerGroup = this.physics.add.group();
        this.enemyGroup = this.physics.add.group();
        this.playerTargetingObjectGroup = this.physics.add.group();
        this.enemyTargetingObjectGroup = this.physics.add.group();
        this.everyoneTargetingObjectGroup = this.physics.add.group();

        this.physics.add.overlap(this.playerTargetingObjectGroup, this.playerGroup, this.spellHitMobCallback);
        this.physics.add.overlap(this.everyoneTargetingObjectGroup, this.playerGroup, this.spellHitMobCallback);

        this.physics.add.overlap(this.enemyTargetingObjectGroup, this.enemyGroup, this.spellHitMobCallback);
        this.physics.add.overlap(this.everyoneTargetingObjectGroup, this.enemyGroup, this.spellHitMobCallback);

        this.physics.add.overlap(this.playerTargetingObjectGroup, this.worldGroup, this.spellHitWorldCallback);
        this.physics.add.overlap(this.enemyTargetingObjectGroup, this.worldGroup, this.spellHitWorldCallback);
        this.physics.add.overlap(this.everyoneTargetingObjectGroup, this.worldGroup, this.spellHitWorldCallback);

        this.map = this.make.tilemap({ key: this.mapToLoad });
        console.log(this.map);
        for (let layer in this.map.layers)
        {

        }
    }

    // Handle when spell hits a mob it targets
    spellHitMobCallback(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
    {
        let spell = <Spell>obj1;
        let mob = <Mob>obj2;

        spell.onHit(mob);
        spell.onMobHit(mob);
    }

    // Handle when spell hits some world object that it may interact
    spellHitWorldCallback(obj1: Phaser.GameObjects.GameObject, obj2: Phaser.GameObjects.GameObject)
    {
        let spell = <Spell>obj1;

        spell.onHit(obj2);
        spell.onWorldHit(obj2);
    }

    update(time: number, dt: number)
    {
        this.children.each((item: Phaser.GameObjects.GameObject) => { item.update(dt / 1000.0); });
        this.unitMgr.update(dt / 1000.0);
    }
}
