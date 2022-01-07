import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";
import { InputManager } from "./inputManager";
import { Enemy, IEnemyEventReceiver } from "./enemy";
import {PlayerController, PlayerControllerSettings} from "./playerController"
import {GameGUI} from  "./GUI"

const PLAYER_SPEED = 10;
const PLAYER_ROTATION_SEED = 7;
const PYLAR_COUNT = 20;
const STAGE_SIZE = 50;
const PYLAR_HEIGHT = 10;
const PYLAR_DIAMETER = 2;
const ENEMY_COUNT = 10;

export class RobotHunterGame implements IEnemyEventReceiver 
{
    mScene: BABYLON.Scene;
    mHTMLCanvas: HTMLCanvasElement;
    mRobotLight: BABYLON.SpotLight;
    mRobotMesh: BABYLON.AbstractMesh;
    mCamera: BABYLON.ArcRotateCamera;
    mPilar: BABYLON.Mesh[];
    mScore: number;
    mTotalTime: number;
    mPlayerController: PlayerController;
    mPlayerControllerSettings : PlayerControllerSettings;

    constructor(scene: BABYLON.Scene, htmlCanvas: HTMLCanvasElement) 
    {
        this.mScene = scene;
        this.mHTMLCanvas = htmlCanvas;
        this.mScore = ENEMY_COUNT;
        this.mTotalTime = 0;
        this.mPlayerControllerSettings = new PlayerControllerSettings(PLAYER_SPEED, PLAYER_ROTATION_SEED);
    }

    buildStage(material : BABYLON.StandardMaterial): void 
    {
        this.mPilar = new Array(PYLAR_COUNT);

        for (var i = 0; i < PYLAR_COUNT; i++) 
        {
            var randomX = (Math.random() - 0.5) * STAGE_SIZE;
            var randomZ = (Math.random() - 0.5) * STAGE_SIZE;

            const options = 
            {
                height: PYLAR_HEIGHT,
                diameterTop: PYLAR_DIAMETER,
                diameterBottom: PYLAR_DIAMETER,
                diameter: PYLAR_DIAMETER,
            };

            var cilinder = BABYLON.MeshBuilder.CreateCylinder("cylinder_${i}",options, this.mScene);
            cilinder.material = material;
            cilinder.position = new BABYLON.Vector3(randomX, PYLAR_HEIGHT / 2, randomZ);
            this.mPilar[i] = cilinder;
        }
    }

    OnEnemyFound(): void
    {
        this.mScore = this.mScore - 1;
        GameGUI.UpdateScore(this.mScore);
    }

    async buildEnemies() : Promise<void>
    {
        var diffuseTexture = new BABYLON.Texture("./textures/character_basecolor.png", this.mScene, undefined, undefined, undefined, undefined,
            function (message?: string, expeption?: any): void {
                console.log('Fail to load character texture with error: ${message}');
            });

        for (let index = 0; index < ENEMY_COUNT; index++) 
        {
            var enemyMaterial = new BABYLON.StandardMaterial("enemy_material", this.mScene);
            enemyMaterial.diffuseTexture = diffuseTexture;
            enemyMaterial.maxSimultaneousLights = ENEMY_COUNT;

            const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "./models/", "enemy.glb", this.mScene);
            var enemy = result.meshes[0].getChildMeshes()[0];
            enemy.material = enemyMaterial;

            var randomX = (Math.random() - 0.5) * STAGE_SIZE;
            var randomZ = (Math.random() - 0.5) * STAGE_SIZE;
            enemy.position = new BABYLON.Vector3(randomX, 0, randomZ);

            var enemyBehaviour = new Enemy(this.mScene, this);
            enemy.addBehavior(enemyBehaviour);
            var actionParameter = { trigger: BABYLON.ActionManager.OnIntersectionEnterTrigger, parameter: enemy };

            this.mRobotMesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(actionParameter, function(event: BABYLON.ActionEvent) 
            {
                var target = event.additionalData as BABYLON.AbstractMesh;
                var enemyBehaviour = target.getBehaviorByName("enemy") as Enemy;
            
                if (!enemyBehaviour.IsActive())
                {
                    enemyBehaviour.SetActive();
                }

            }));
        }
    }


    async start(): Promise<void> 
    {
        this.mScene.clearColor = new BABYLON.Color4(0, 0, 0, 1.0);
        this.mCamera = new BABYLON.ArcRotateCamera("Camera", Math.PI / 4, Math.PI / 4, 20, new BABYLON.Vector3(0, 0, 0), this.mScene);
        this.mCamera.lowerRadiusLimit = 10;
        this.mCamera.upperRadiusLimit = 20;
        this.mCamera.wheelDeltaPercentage = 0.01;
        this.mCamera.upperBetaLimit = Math.PI / 3;
        this.mCamera.attachControl(this.mHTMLCanvas, true);
        this.mScene.actionManager = new BABYLON.ActionManager(this.mScene);
        InputManager.initialize(this.mScene);

        this.mRobotLight = new BABYLON.SpotLight("light1", new BABYLON.Vector3(0, 5, 2), BABYLON.Vector3.Down(), 180, 10, this.mScene);
        this.mRobotLight.shadowEnabled = true;

        const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "./models/", "littleRobot.glb", this.mScene);
        this.mRobotMesh = result.meshes[0].getChildMeshes()[0];
        this.mRobotMesh.actionManager = new BABYLON.ActionManager(this.mScene);
        this.mRobotLight.parent = this.mRobotMesh;

        var robotMaterial = new BABYLON.StandardMaterial("robotMaterial", this.mScene);
        robotMaterial.maxSimultaneousLights = ENEMY_COUNT;
        robotMaterial.diffuseTexture = new BABYLON.Texture("./textures/character_basecolor.png", this.mScene, undefined, undefined, undefined, undefined,
            function (message?: string, expeption?: any): void {
                console.log('Fail to load character texture with error: ${message}');
            });
            
        robotMaterial.emissiveTexture = new BABYLON.Texture("./textures/character_emission.png", this.mScene, undefined, undefined, undefined, undefined,
            function (message?: string, expeption?: any): void {
                console.log('Fail to load character texture with error: ${message}');
            });

        robotMaterial.linkEmissiveWithDiffuse = true;
        robotMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
        robotMaterial.roughness = 1;
        robotMaterial.specularPower = 20;
        this.mRobotMesh.material = robotMaterial;

        var groundDiffuseTexture = new BABYLON.Texture("./textures/checkboard_mips.png", this.mScene);
        groundDiffuseTexture.vScale = 10;
        groundDiffuseTexture.uScale = 10;

        var groundBumpTexture = new BABYLON.Texture("./textures/tile_nmap.png", this.mScene);
        groundBumpTexture.vScale = 10;
        groundBumpTexture.uScale = 10;

        // Ground
        var ground = BABYLON.MeshBuilder.CreateGround("ground", { height: STAGE_SIZE, width: STAGE_SIZE, subdivisions: 4 }, this.mScene);
        var groundMaterial = new BABYLON.StandardMaterial("groundMaterial", this.mScene);
        groundMaterial.maxSimultaneousLights = ENEMY_COUNT;
        groundMaterial.diffuseTexture = groundDiffuseTexture;
        groundMaterial.bumpTexture = groundBumpTexture;
        groundMaterial.diffuseTexture.wrapU = 1;
        groundMaterial.diffuseTexture.wrapV = 1;
        groundMaterial.specularColor = new BABYLON.Color3(1, 1, 1);
        ground.material = groundMaterial;
        ground.receiveShadows = true;

        this.mCamera.setTarget(this.mRobotMesh)

        this.buildStage(groundMaterial);
        this.buildEnemies();

        this.mPlayerController = new PlayerController(this.mRobotMesh, this.mPlayerControllerSettings, this.mPilar, ground.getBoundingInfo().boundingBox);

        GameGUI.initialize(this.mScene);
        console.log("Finished game startup");
    }

    update(deltaTime: number): void 
    {
        this.mTotalTime += deltaTime;
        this.mPlayerController.update(deltaTime);
        GameGUI.UpdateTime(this.mTotalTime);
    }

    shutdown(): void 
    {

    }
}