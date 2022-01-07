import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";

import * as BABYLON from "@babylonjs/core";
import * as GUI from '@babylonjs/gui/2D';

export abstract class GameGUI
{
    static scoreText: GUI.TextBlock;
    static timerText: GUI.TextBlock;

    static initialize(scene: BABYLON.Scene) : void
    {
        //Score panel
        var scorePanel = new GUI.StackPanel();
        scorePanel.isVertical = false;
        scorePanel.paddingTop = "100px";
        scorePanel.paddingRight = "50px";
        scorePanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        scorePanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

        var advancedTexture = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI", true, scene);

        var enemyImage = new GUI.Image("enemy_gui","./icons/enemy_icon.png");
        enemyImage.width = "100px";
        enemyImage.height = "100px";
        enemyImage.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        enemyImage.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

        scorePanel.addControl(enemyImage);

        GameGUI.scoreText = new GUI.TextBlock();
        GameGUI.scoreText.width = "150px";
        GameGUI.scoreText.height = "100px";
        GameGUI.scoreText.color = "white";
        GameGUI.scoreText.text = " X 10";
        GameGUI.scoreText.paddingTop = "50px";
        GameGUI.scoreText.fontSize = "50px";
        GameGUI.scoreText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
        GameGUI.scoreText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

        scorePanel.addControl(GameGUI.scoreText);
        advancedTexture.addControl(scorePanel);

        //Time panel
        var timePanel = new GUI.StackPanel();
        timePanel.isVertical = false;
        timePanel.paddingTop = "100px";
        timePanel.paddingRight = "50px";
        timePanel.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        timePanel.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

        GameGUI.timerText = new GUI.TextBlock();
        GameGUI.timerText.width = "300px";
        GameGUI.timerText.height = "300px";
        GameGUI.timerText.color = "white";
        GameGUI.timerText.paddingTop = "10px";
        GameGUI.timerText.fontSize = "20px";
        GameGUI.timerText.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        GameGUI.timerText.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;

        timePanel.addControl(GameGUI.timerText);
        advancedTexture.addControl(timePanel);
    }

    static UpdateScore(score : number) : void
    {
        GameGUI.scoreText.text = " X " +  score;
    }

    static UpdateTime(time : number): void
    {
        GameGUI.timerText.text = "Total time: " + Math.floor(time).toString() + " s";
    }
}