import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import * as BABYLON from "@babylonjs/core";
import { RobotHunterGame } from "./robothunter/game";

class App 
{
    constructor() 
    {
        // create the canvas html element and attach it to the webpage
        var canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        canvas.id = "gameCanvas";
        document.body.appendChild(canvas);

        // initialize babylon scene and engine
        var engine = new BABYLON.Engine(canvas, true);
        var scene = new BABYLON.Scene(engine);
        var robotHunter = new RobotHunterGame(scene, canvas);

        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => 
        {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) 
            {
                if (scene.debugLayer.isVisible()) 
                {
                    scene.debugLayer.hide();
                } else 
                {
                    scene.debugLayer.show();
                }
            }
        });

        robotHunter.start().then(function() : void 
        {
            console.log("Starting rendering loop");

            // run the main render loop
            engine.runRenderLoop(() => 
            {
                robotHunter.update(engine.getDeltaTime() / 1000);
                scene.render();
            });
        });
    }
}

new App();