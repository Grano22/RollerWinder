@echo off
:softwareStart
title Generate Symfony-React project
echo Enter project name
set /p ProjectName=Type your project name: 
echo You want to create a first controller in symfony?
set /p FirstControllerDecision=Y(es) or N(o): 
if "%FirstControllerDecision%" == "Y" (
    if "%FirstControllerDecision%" == "Yes" (
        goto namingFirstControler
    )
)
if "%FirstControllerDecision%" == "N" (
    if "%FirstControllerDecision%" == "No" (
        goto summarySet
    )
)

:namingFirstControler
echo Enter your Symfony first controller name
set /p FirstControllerName=Enter name: 
goto summarySet

:summarySet
echo Summary
echo Project name: %ProjectName%
echo First controller name: %FirstControllerName%
pause
echo Generating new Symfony-React project...
WHERE yarn -v
IF %ERRORLEVEL% NEQ 0 (
    ECHO Yarn not detected, trying to install yarn...
    pause
    exit
)
composer create-project %ProjectName%
if "%FirstControllerDecision%" == "Y" (
    if "%FirstControllerDecision%" == "Yes" (
        php bin/console make:controller %FirstControllerName%
    )
)
composer require symfony/webpack-encore-bundle
yarn add @babel/preset-react --dev
yarn add react-router-dom
yarn add --dev react react-dom prop-types axios
yarn add @babel/plugin-proposal-class-properties @babel/plugin-transform-runtime
yarn add @babel/plugin-syntax-jsx --dev
yarn install