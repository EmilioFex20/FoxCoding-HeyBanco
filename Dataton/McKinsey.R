library(dplyr)
library(ggplot2)
library(ggrepel)
library(scales)

df_modelo <- df %>%
  filter(intencion %in% c("consulta","queja")) %>%
  
  mutate(
    es_negativa = emocion %in% c("frustracion","miedo","urgencia"),
    
    peso_emocion = case_when(
      emocion == "miedo" ~ 3,
      emocion == "frustracion" ~ 2,
      emocion == "urgencia" ~ 1.5,
      TRUE ~ 0
    ),
    
    categoria = coalesce(tipo_consulta, tipo_queja),
    tipo = intencion
  ) %>%
  
  group_by(categoria, tipo) %>%
  summarise(
    volumen = n(),
    friccion = mean(es_negativa),
    severidad = mean(peso_emocion),
    .groups = "drop"
  ) %>%
  
  mutate(
    impacto = volumen * friccion,
    
    volumen_alto = volumen > quantile(volumen, 0.75),
    
    tipo_oportunidad = case_when(
      friccion > 0.6 & volumen_alto ~ "🔥 crítica",
      friccion > 0.6 ~ "⚠️ dolor puntual",
      volumen_alto ~ "📈 optimización",
      TRUE ~ "🟢 menor"
    )
  )

top_insights <- df_modelo %>%
  arrange(desc(impacto)) %>%
  slice_head(n = 3) %>%
  mutate(
    insight = paste0(
      toupper(categoria), " (", tipo, "): ",
      round(friccion*100), "% fricción con ",
      volumen, " casos → oportunidad ",
      tipo_oportunidad
    )
  )

insight_text <- paste(top_insights$insight, collapse = "\n")

top_categoria <- df_modelo %>%
  arrange(desc(impacto)) %>%
  slice(1)

titulo <- paste0(
  "Principales fricciones se concentran en '",
  top_categoria$categoria,
  "' con alto impacto en usuarios"
)

ggplot(df_modelo, aes(
  x = impacto,
  y = friccion,
  size = volumen,
  color = tipo_oportunidad,
  shape = tipo
)) +
  
  geom_point(alpha = 0.85) +
  
  ggrepel::geom_text_repel(
    aes(label = categoria),
    size = 3,
    max.overlaps = 15
  ) +
  
  scale_y_continuous(labels = percent_format()) +
  
  scale_color_manual(values = c(
    "crítica" = "#d73027",
    "dolor puntual" = "#fc8d59",
    "optimización" = "#1a9850",
    "menor" = "#91bfdb"
  )) +
  
  scale_shape_manual(values = c(
    "consulta" = 16,
    "queja" = 17
  )) +
  
  labs(
    title = titulo,
    subtitle = insight_text,
    x = "Impacto (volumen x fricción)",
    y = "% Fricción",
    size = "Volumen",
    color = "Tipo de oportunidad",
    shape = "Tipo interacción"
  ) +
  
  theme_minimal(base_size = 12) +
  theme(
    plot.title = element_text(face = "bold", size = 14),
    plot.subtitle = element_text(size = 10, color = "gray30"),
    legend.position = "right",
    panel.grid.minor = element_blank()
  )