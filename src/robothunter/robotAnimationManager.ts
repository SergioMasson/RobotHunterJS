import * as BABYLON from "@babylonjs/core";

export class RobotAnimationManager {
  mPlayerMesh: BABYLON.AbstractMesh;
  mAnimationGroup: BABYLON.AnimationGroup;
  mSpeed : number;

  constructor(mesh: BABYLON.AbstractMesh, speed : number) {
    this.mPlayerMesh = mesh;
    console.log(mesh.position);
    this.mAnimationGroup = new BABYLON.AnimationGroup("WalkAnimation");
    this.CreateWalkAnimation();
    this.mSpeed = speed;
  }

  private CreateWalkAnimation(): void {
    const frameRate = 30;

    const maxJumRotation = BABYLON.PHI / 3;

    var jumpRotation = new BABYLON.Animation(
      "jumbRotatin",
      "rotation",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    var jumpRotationKeys = [];

    jumpRotationKeys.push({
      frame: 0,
      value: new BABYLON.Vector3(0, 0, 0)
    });

    jumpRotationKeys.push({
      frame: 0.1 * frameRate,
      value:  new BABYLON.Vector3(-maxJumRotation/2, 0, 0)
    });

    jumpRotationKeys.push({
      frame: 0.2 * frameRate,
      value: new BABYLON.Vector3(-maxJumRotation, 0, 0)
    });

    jumpRotationKeys.push({
      frame: 0.3 * frameRate,
      value: new BABYLON.Vector3(-maxJumRotation/2, 0, 0)
    });

    jumpRotation.setKeys(jumpRotationKeys);

    var jumpY = new BABYLON.Animation(
      "jumpY",
      "position.y",
      frameRate,
      BABYLON.Animation.ANIMATIONTYPE_FLOAT,
      BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
    );

    var jumpYKeys = [];

    jumpYKeys.push({
      frame: 0,
      value: 0
    });

    jumpYKeys.push({
      frame: 0.2 * frameRate,
      value: 0.25
    });

    jumpYKeys.push({
      frame: 0.3 * frameRate,
      value: 0.5
    });

    jumpYKeys.push({
      frame: 0.4 * frameRate,
      value: 0.25
    });

    jumpY.setKeys(jumpYKeys);

    this.mAnimationGroup.addTargetedAnimation(jumpY, this.mPlayerMesh);
    this.mAnimationGroup.addTargetedAnimation(jumpRotation, this.mPlayerMesh);
  }

  Play(): void {
    this.mAnimationGroup.play(true);
  }
}