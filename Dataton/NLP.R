library(dplyr)
library(stringr)

df <- df %>%
  mutate(
    # =========================
    # INTENCIÓN
    # =========================
    intencion = case_when(
      str_detect(input, "no puedo|no funciona|error|falla|problema|rechazado|fallo") ~ "queja",
      str_detect(input, "como|cual|donde|puedo|podria|ayuda") ~ "consulta",
      str_detect(input, "gracias|excelente|bien") ~ "positivo",
      TRUE ~ "otro"
    ),
    
    # =========================
    # QUEJAS
    # =========================
    tipo_queja = case_when(
      intencion == "queja" & str_detect(input, "error|falla|fallo") ~ "error tecnico",
      intencion == "queja" & str_detect(input, "no puedo|no funciona|bloqueado") ~ "bloqueo",
      intencion == "queja" & str_detect(input, "transferencia|deposito|no llega") ~ "problemas transferencias",
      intencion == "queja" & str_detect(input, "tarjeta.*rechaz|declin") ~ "tarjeta rechazada",
      intencion == "queja" & str_detect(input, "login|acceso|contrasena") ~ "problemas acceso",
      intencion == "queja" & str_detect(input, "app|aplicacion") ~ "problemas app",
      intencion == "queja" & str_detect(input, "cobro|comision|cargo") ~ "cargos no reconocidos",
      intencion == "queja" & str_detect(input, "lento|tarda") ~ "lentitud",
      intencion == "queja" & str_detect(input, "reembolso") ~ "reembolso",
      intencion == "queja" & str_detect(input, "token") ~ "token",
      TRUE ~ NA_character_
    ),
    
    # =========================
    # CONSULTAS
    # =========================
    tipo_consulta = case_when(
      intencion == "consulta" & str_detect(input, "abrir cuenta|crear cuenta") ~ "apertura cuenta",
      intencion == "consulta" & str_detect(input, "cancelar") ~ "cancelar",
      intencion == "consulta" & str_detect(input, "verificacion|ine") ~ "verificacion",
      intencion == "consulta" & str_detect(input, "tarjeta|credito") ~ "tarjetas/credito",
      intencion == "consulta" & str_detect(input, "transferencia|spei") ~ "transferencias",
      intencion == "consulta" & str_detect(input, "limite|prestamo") ~ "limite/prestamo",
      intencion == "consulta" & str_detect(input, "cashback") ~ "cashback",
      intencion == "consulta" & str_detect(input, "divisas|dolares") ~ "divisas",
      intencion == "consulta" & str_detect(input, "meses|msi") ~ "mensualidades",
      intencion == "consulta" & str_detect(input, "inversion") ~ "inversiones",
      intencion == "consulta" & str_detect(input, "impuestos") ~ "impuestos",
      intencion == "consulta" & str_detect(input, "auto|vehiculo") ~ "credito automotriz",
      intencion == "consulta" & str_detect(input, "app|error|no funciona") ~ "problemas app",
      intencion == "consulta" & str_detect(input, "telefono|contacto") ~ "contacto",
      intencion == "consulta" & str_detect(input, "asesor|humano") ~ "hablar con asesor",
      intencion == "consulta" & str_detect(input, "evento|ticket") ~ "eventos/promos",
      intencion == "consulta" & str_detect(input, "saldo|estado cuenta") ~ "consultas saldo",
      intencion == "consulta" & str_detect(input, "cajero|retiro") ~ "retiros/cajeros",
      intencion == "consulta" & str_detect(input, "sucursal") ~ "ubicaciones",
      intencion == "consulta" & str_detect(input, "viaje") ~ "viajes",
      TRUE ~ NA_character_
    )
  )

emociones_dic <- list(
  frustracion = "no funciona|error|fallo|falla|bloqueado|rechazado|no puedo|no sirve|problema|no deja",
  urgencia = "urgente|necesito|ya|ahora|rapido|inmediato|no ha llegado|pendiente|cuanto tarda",
  confusion = "no entiendo|como funciona|como le hago|que significa|donde veo|no encuentro",
  confianza = "gracias|perfecto|excelente|ok|vale|listo|funciono",
  interes = "quiero saber|como puedo|me gustaria|informacion",
  miedo = "fraude|robo|no reconocido|cargo indebido|me quitaron dinero|deuda|adeudo"
)

df <- df %>%
  mutate(
    emocion = case_when(
      str_detect(input, emociones_dic$frustracion) ~ "frustracion",
      str_detect(input, emociones_dic$urgencia) ~ "urgencia",
      str_detect(input, emociones_dic$miedo) ~ "miedo",
      str_detect(input, emociones_dic$confusion) ~ "confusion",
      str_detect(input, emociones_dic$confianza) ~ "confianza",
      str_detect(input, emociones_dic$interes) ~ "interes",
      TRUE ~ "neutral"
    )
  )

df <- df %>%
  mutate(
    cluster_emocion = case_when(
      intencion == "queja" ~ paste(emocion, tipo_queja, sep = " - "),
      intencion == "consulta" ~ paste(emocion, tipo_consulta, sep = " - "),
      TRUE ~ emocion
    )
  )

top_clusters <- df %>%
  count(cluster_emocion, sort = TRUE)

head(top_clusters, 15)


write.csv(df, "dataset_con_sentimiento_emociones.csv",
          row.names = FALSE,
          fileEncoding = "UTF-8")



df %>%
  mutate(es_negativa = emocion %in% c("frustracion","miedo","urgencia")) %>%
  group_by(cluster_emocion) %>%
  summarise(
    volumen = n(),
    friccion = mean(es_negativa)
  ) %>%
  arrange(desc(friccion))

write.csv(df, "dataset_con_sentimiento_emociones2.csv",
          row.names = FALSE,
          fileEncoding = "UTF-8")

library(ggplot2)

df %>%
  filter(intencion == "consulta") %>%
  mutate(es_negativa = emocion %in% c("frustracion","miedo","urgencia")) %>%
  group_by(tipo_consulta) %>%
  summarise(friccion = mean(es_negativa)) %>%
  arrange(desc(friccion)) %>%
  ggplot(aes(x = reorder(tipo_consulta, friccion), y = friccion)) +
  geom_col() +
  coord_flip() +
  labs(
    title = "Ranking de fricción por tipo de consulta",
    y = "% fricción",
    x = ""
  ) +
  theme_minimal()

df %>%
  count(cluster_emocion) %>%
  mutate(pct = n / sum(n)) %>%
  arrange(desc(n)) %>%
  head(15)
