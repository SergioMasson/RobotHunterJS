import * as BABYLON from "@babylonjs/core";
import { InputManager } from "./inputManager";

export class PlayerControllerSettings
{
    movementSpeed : number;
    rotationSpeed : number;

    constructor(movementSpeed: number, rotationSpeed: number)
    {
        this.movementSpeed = movementSpeed;
        this.rotationSpeed = rotationSpeed;
    }
}

export class PlayerController
{
    mPlayer : BABYLON.AbstractMesh;
    mPilars: BABYLON.Mesh[];
    mWorldBB: BABYLON.BoundingBox;
    mSettings: PlayerControllerSettings;
    mLastPosition: BABYLON.Vector3;
    mLastRotation: BABYLON.Vector3;

    constructor(player: BABYLON.AbstractMesh, settings : PlayerControllerSettings ,pilars: BABYLON.Mesh[], world: BABYLON.BoundingBox)
    {
        this.mPlayer = player;
        this.mSettings = settings;
        this.mWorldBB = world;
        this.mPilars = pilars;
        this.mLastPosition = new BABYLON.Vector3(0, 0, 0);
        this.mLastRotation = new BABYLON.Vector3(0, 0, 0);
    }

    update(deltaTime : number) : void
    {
        var fowardVec: BABYLON.Vector3 = new BABYLON.Vector3(0, 0, 0);

        if (InputManager.IsPressed("w")) 
            fowardVec = new BABYLON.Vector3(0, 0, 1 * this.mSettings.movementSpeed * deltaTime);
        else if (InputManager.IsPressed("s")) 
            fowardVec = new BABYLON.Vector3(0, 0, -1 * this.mSettings.movementSpeed * deltaTime);

        this.mPlayer.locallyTranslate(fowardVec);

        var rotationSpeed = 0;

        if (InputManager.IsPressed("a")) 
            rotationSpeed = this.mSettings.rotationSpeed * deltaTime;
        else if (InputManager.IsPressed("d")) 
            rotationSpeed = -this.mSettings.rotationSpeed * deltaTime;

        this.mPlayer.rotate(BABYLON.Vector3.Up(), rotationSpeed);

        var intersect= false;

        var worldPosition = this.mPlayer.getAbsolutePosition();

        if(!this.mWorldBB.intersectsPoint(worldPosition))
        {
            intersect = true;
        }
        else
        {
            for (let index = 0; index < this.mPilars.length; index++) 
            {
                if(this.mPilars[index].intersectsPoint(worldPosition))
                {
                    intersect = true;
                    break;
                }
            }
        }

        
        if(intersect)
        {
            this.mPlayer.position.copyFrom(this.mLastPosition);
            this.mPlayer.rotation.copyFrom(this.mLastRotation);
            return;
        }
        else
        {
            this.mLastPosition.copyFrom(this.mPlayer.position);
            this.mLastRotation.copyFrom(this.mPlayer.rotation);
        }
    }
}
