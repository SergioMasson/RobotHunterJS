import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";

export interface IEnemyEventReceiver 
{
    OnEnemyFound(): void;
}

export class Enemy implements BABYLON.Behavior<BABYLON.Mesh>
{
    mIsActive: boolean;
    mLight: BABYLON.Light;
    mScene: BABYLON.Scene;
    name: string;
    onActiveCallback: IEnemyEventReceiver;
    mColor: BABYLON.Color3;
    mEnemyMaterial : BABYLON.StandardMaterial;

    constructor(scene : BABYLON.Scene, receiver: IEnemyEventReceiver)
    {
        this.mIsActive = false;
        this.mScene = scene;
        this.name = "enemy";
        this.onActiveCallback = receiver;
        this.mColor = new BABYLON.Color3(Math.random(), Math.random(), Math.random());
    }

    init(): void 
    {
        
    }

    attach(target: BABYLON.Mesh): void 
    {
        var worldPosition = target.getAbsolutePosition();
        this.mLight = new BABYLON.SpotLight("enemy_Light", worldPosition.add(new BABYLON.Vector3(0, 5, 0)), BABYLON.Vector3.Down(), 180, 30, this.mScene);
        this.mLight.diffuse = this.mColor;
        this.mLight.specular = this.mColor;
        this.mLight.setEnabled(false);
        this.mEnemyMaterial = target.material as BABYLON.StandardMaterial;
    }

    detach(): void 
    {
    }

    IsActive() : boolean
    {
        return this.mIsActive;
    }

    SetActive() : void
    {
        this.mIsActive = true;
        this.mLight.setEnabled(true);
        this.mEnemyMaterial.emissiveColor = this.mColor;
        this.mEnemyMaterial.diffuseColor = this.mColor;
        this.onActiveCallback.OnEnemyFound();
    }
}