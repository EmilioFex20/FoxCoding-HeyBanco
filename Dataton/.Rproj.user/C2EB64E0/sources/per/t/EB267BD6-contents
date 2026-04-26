library(scales)

VALOR_CASO <- 50   # 👈 AJUSTA (ej: $50 MXN por mala experiencia)

df_modelo <- df_modelo %>%
  mutate(
    impacto_negocio = volumen * friccion * severidad * VALOR_CASO,
    impacto_negocio_norm = rescale(impacto_negocio)
  )

df_modelo <- df_modelo %>%
  mutate(
    tipo_solucion = case_when(
      
      # 🔥 crítico estructural
      friccion > 0.6 & volumen > quantile(volumen, 0.75) ~ "🔥 problema estructural",
      
      # ⚡ quick win (alto impacto, fácil)
      friccion < 0.4 & volumen > quantile(volumen, 0.75) ~ "⚡ quick win",
      
      # 😬 dolor relevante
      friccion > 0.6 ~ "⚠️ dolor puntual",
      
      TRUE ~ "🟢 monitoreo"
    )
  )

top_insights <- df_modelo %>%
  arrange(desc(impacto_negocio)) %>%
  slice_head(n = 5) %>%
  mutate(
    insight = paste0(
      "• ", toupper(categoria), " (", tipo, "): ",
      round(friccion*100), "% fricción, ",
      volumen, " casos → impacto estimado $",
      comma(round(impacto_negocio)),
      " → ", tipo_solucion
    )
  )

cat(paste(top_insights$insight, collapse = "\n"))

ggplot(df_modelo, aes(
  x = impacto_negocio,
  y = friccion,
  size = volumen,
  color = tipo_solucion,
  shape = tipo
)) +
  
  geom_point(alpha = 0.85) +
  
  ggrepel::geom_text_repel(
    aes(label = categoria),
    size = 3,
    max.overlaps = 15
  ) +
  
  scale_y_continuous(labels = percent_format()) +
  
  scale_x_continuous(labels = dollar_format()) +
  
  scale_color_manual(values = c(
    "🔥 problema estructural" = "#d73027",
    "⚡ quick win" = "#1a9850",
    "⚠️ dolor puntual" = "#fc8d59",
    "🟢 monitoreo" = "#91bfdb"
  )) +
  
  scale_shape_manual(values = c(
    "consulta" = 16,
    "queja" = 17
  )) +
  
  labs(
    title = "Priorización de iniciativas basada en impacto económico",
    subtitle = "Combina volumen, fricción y severidad emocional",
    x = "Impacto económico estimado ($)",
    y = "% Fricción",
    size = "Volumen",
    color = "Tipo de solución",
    shape = "Tipo interacción"
  ) +
  
  theme_minimal(base_size = 12) +
  theme(
    plot.title = element_text(face = "bold"),
    legend.position = "right",
    panel.grid.minor = element_blank()
  )

df_modelo %>%
  group_by(tipo_solucion) %>%
  summarise(
    impacto_total = sum(impacto_negocio),
    categorias = n()
  )