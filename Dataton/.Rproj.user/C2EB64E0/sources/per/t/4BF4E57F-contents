library(dplyr)
library(ggplot2)
library(scales)

# =========================
# 1. MODELO BASE
# =========================
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
    
    categoria = coalesce(tipo_consulta, tipo_queja)
  ) %>%
  
  group_by(categoria) %>%
  summarise(
    volumen = n(),
    friccion = mean(es_negativa),
    severidad = mean(peso_emocion),
    .groups = "drop"
  )

# =========================
# 2. FEATURES EXTRA
# =========================
df_modelo <- df_modelo %>%
  mutate(
    volumen_alto = volumen > quantile(volumen, 0.75),
    
    score = (friccion * 0.5) + 
      (rescale(volumen) * 0.3) + 
      (rescale(severidad) * 0.2),
    
    impacto = volumen * friccion,
    
    tipo_oportunidad = case_when(
      friccion > 0.6 & volumen_alto ~ "🔥 crítica",
      friccion > 0.6 ~ "⚠️ dolor puntual",
      volumen_alto ~ "📈 optimización",
      TRUE ~ "🟢 menor"
    )
  ) %>%
  arrange(desc(score))

# =========================
# 3. GRÁFICA RANKING
# =========================
df_modelo %>%
  ggplot(aes(x = reorder(categoria, score), y = score)) +
  geom_col() +
  coord_flip() +
  labs(
    title = "Ranking automático de oportunidades",
    y = "Opportunity Score",
    x = ""
  ) +
  theme_minimal()

# =========================
# 4. INSIGHTS AUTOMÁTICOS (SIMPLE)
# =========================
top_insights <- df_modelo %>%
  slice_head(n = 5) %>%
  mutate(
    insight = paste0(
      "• ", toupper(categoria), ": ",
      "Alta fricción (", round(friccion*100), "%) con volumen de ", volumen,
      ". Indica problema crítico en experiencia del usuario."
    )
  )

top_insights$insight

# =========================
# 5. INSIGHTS AUTOMÁTICOS (PRO - CON EMOCIÓN)
# =========================
top_insights_pro <- df %>%
  mutate(
    es_negativa = emocion %in% c("frustracion","miedo","urgencia"),
    categoria = coalesce(tipo_consulta, tipo_queja)
  ) %>%
  
  group_by(categoria, emocion) %>%
  summarise(n = n(), .groups = "drop") %>%
  
  group_by(categoria) %>%
  mutate(pct = n / sum(n)) %>%
  
  filter(emocion %in% c("frustracion","miedo","urgencia")) %>%
  slice_max(pct, n = 1) %>%
  
  left_join(df_modelo, by = "categoria") %>%
  
  arrange(desc(score)) %>%
  slice_head(n = 5) %>%
  
  mutate(
    insight = paste0(
      "• ", toupper(categoria), ": Dominado por ",
      emocion, " (", round(pct*100), "%). ",
      "Alta fricción con volumen de ", volumen,
      " → oportunidad clara de mejora."
    )
  )

top_insights_pro$insight




library(dplyr)
library(ggplot2)
library(scales)

# =========================
# MODELO
# =========================
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
    
    categoria = coalesce(tipo_consulta, tipo_queja)
  ) %>%
  
  group_by(categoria) %>%
  summarise(
    volumen = n(),
    friccion = mean(es_negativa),
    severidad = mean(peso_emocion),
    .groups = "drop"
  ) %>%
  
  mutate(
    volumen_alto = volumen > quantile(volumen, 0.75),
    
    impacto = volumen * friccion,
    
    score = (friccion * 0.5) + 
      (rescale(volumen) * 0.3) + 
      (rescale(severidad) * 0.2),
    
    tipo_oportunidad = case_when(
      friccion > 0.6 & volumen_alto ~ "🔥 crítica",
      friccion > 0.6 ~ "⚠️ dolor puntual",
      volumen_alto ~ "📈 optimización",
      TRUE ~ "🟢 menor"
    )
  ) %>%
  
  arrange(desc(impacto))

install.packages("ggrepel")
install.packages("scales")
library(ggrepel)
library(scales)

df_modelo %>%
  mutate(
    impacto = volumen * friccion,
    
    # recortar outliers para mejor visual
    impacto_plot = pmin(impacto, quantile(impacto, 0.95)),
    friccion_plot = pmin(friccion, quantile(friccion, 0.95))
  ) %>%
  
  ggplot(aes(
    x = impacto_plot,
    y = friccion_plot,
    size = volumen,
    color = tipo_oportunidad
  )) +
  
  geom_point(alpha = 0.8) +
  
  # etiquetas inteligentes (NO se enciman)
  ggrepel::geom_text_repel(
    aes(label = categoria),
    size = 3,
    max.overlaps = 15
  ) +
  
  # líneas de referencia (cuadrantes)
  geom_vline(xintercept = median(df_modelo$impacto), linetype = "dashed", color = "gray50") +
  geom_hline(yintercept = median(df_modelo$friccion), linetype = "dashed", color = "gray50") +
  
  scale_y_continuous(labels = percent_format()) +
  
  scale_color_manual(values = c(
    "🔥 crítica" = "#d73027",
    "⚠️ dolor puntual" = "#fc8d59",
    "📈 optimización" = "#1a9850",
    "🟢 menor" = "#91bfdb"
  )) +
  
  labs(
    title = "Mapa de oportunidades: Impacto vs Fricción",
    subtitle = "Prioriza donde hay más usuarios afectados y mayor dolor",
    x = "Impacto (volumen x fricción)",
    y = "% Fricción",
    size = "Volumen",
    color = "Tipo de oportunidad"
  ) +
  
  theme_minimal(base_size = 12) +
  theme(
    legend.position = "right",
    plot.title = element_text(face = "bold", size = 14),
    plot.subtitle = element_text(size = 11, color = "gray40"),
    panel.grid.minor = element_blank(),
    panel.grid.major.x = element_blank()
  )