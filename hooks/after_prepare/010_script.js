#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Ruta al archivo cdv-gradle-config.json
const gradleConfigPath = path.join(__dirname, '..', '..', 'platforms', 'android', 'cdv-gradle-config.json');

// Verifica si el archivo existe
if (fs.existsSync(gradleConfigPath)) {
    // Leer el contenido del archivo
    const gradleConfig = JSON.parse(fs.readFileSync(gradleConfigPath, 'utf-8'));

    // Actualizar los valores deseados
    gradleConfig.MIN_SDK_VERSION = 22;
    gradleConfig.SDK_VERSION = 34;
    gradleConfig.COMPILE_SDK_VERSION = 34;
    gradleConfig.GRADLE_VERSION = '8.1.1';
    gradleConfig.MIN_BUILD_TOOLS_VERSION = '34.0.0';
    gradleConfig.AGP_VERSION = '8.1.0';
    gradleConfig.KOTLIN_VERSION = '1.7.21';
    gradleConfig.ANDROIDX_APP_COMPAT_VERSION = '1.6.1';
    gradleConfig.ANDROIDX_WEBKIT_VERSION = '1.6.0';
    gradleConfig.ANDROIDX_CORE_SPLASHSCREEN_VERSION = '1.0.0';
    gradleConfig.GRADLE_PLUGIN_GOOGLE_SERVICES_VERSION = '4.3.15';

    // Escribir los cambios en el archivo
    fs.writeFileSync(gradleConfigPath, JSON.stringify(gradleConfig, null, 2), 'utf-8');
    console.log('Updated cdv-gradle-config.json with custom values.');
} else {
    console.log('cdv-gradle-config.json not found.');
}