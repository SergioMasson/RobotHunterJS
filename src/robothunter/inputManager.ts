import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, Light, Behavior, ActionManager, ExecuteCodeAction } from "@babylonjs/core";

export abstract class InputManager
{
    static inputMap: any;

    static initialize(scene : Scene) : void
    {
        InputManager.inputMap = {};

        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, function (evt) 
        {
            InputManager.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
        
        scene.actionManager.registerAction(new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, function (evt) 
        {
            InputManager.inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
    }

    static IsPressed(key: any) : boolean 
    {
        return InputManager.inputMap[key];
    }
}