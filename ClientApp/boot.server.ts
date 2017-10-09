import 'zone.js';
import './polyfills/server.polyfills';
import { createServerRenderer, RenderResult } from 'aspnet-prerendering';
import { enableProdMode } from '@angular/core';
import { INITIAL_CONFIG } from '@angular/platform-server';
import { ngAspnetCoreEngine, IEngineOptions, createTransferScript } from './polyfills/temporary-aspnetcore-engine';
import { AppModule } from './app/app.module.server';

enableProdMode();

export default createServerRenderer(params => {
    // Platform-server provider configuration
    const setupOptions: IEngineOptions = {
        appSelector: '<app></app>',
        ngModule: AppModule,
        request: params,
        providers: [
            // Optional - Any other Server providers you want to pass (remember you'll have to provide them for the Browser as well)
        ]
    };

    return ngAspnetCoreEngine(setupOptions).then(response => {
        // Apply your transferData to response.globals
        response.globals.transferData = createTransferScript({
            someData: 'Transfer this to the client on the window.TRANSFER_CACHE {} object',
            fromDotnet: params.data.thisCameFromDotNET // example of data coming from dotnet, in HomeController
        });

        response.globals.title = "Unifacto"

        return ({
            html: response.html,
            globals: response.globals
        });
    });
});
