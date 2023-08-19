package com.example.fpsmod6;

import net.minecraft.client.Minecraft;
import net.minecraftforge.client.event.RenderGameOverlayEvent;
import net.minecraftforge.common.MinecraftForge;
import net.minecraftforge.fml.common.Mod;
import net.minecraftforge.fml.common.Mod.EventHandler;
import net.minecraftforge.fml.common.event.FMLInitializationEvent;
import net.minecraftforge.fml.common.eventhandler.SubscribeEvent;

@Mod(modid = "fpsmod6", version = "1.0")
public class fpsmod6 {
    public static final String MODID = "fpsmod6";
    public static final String VERSION = "1.0";

    @EventHandler
    public void init(FMLInitializationEvent event) {
        MinecraftForge.EVENT_BUS.register(this);
    }

    @SubscribeEvent
    public void onRenderGameOverlay(RenderGameOverlayEvent event) {
        if (event.type == RenderGameOverlayEvent.ElementType.TEXT) {
            Minecraft mc = Minecraft.getMinecraft();
            int fps = Minecraft.getDebugFPS();

            mc.fontRendererObj.drawStringWithShadow("FPS: " + fps, 2, 5, 0xFFFFFF);
        }
    }
}