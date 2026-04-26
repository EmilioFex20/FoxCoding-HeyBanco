.rs.restartR()

install.packages("tidyr")
install.packages("ggplot2")
install.packages("syuzhet")

library(syuzhet)

# =========================
# LIBRERÍAS
# =========================
library(readr)
library(dplyr)
library(tidytext)
library(stopwords)
library(tidyr)
library(stringr)
library(ggplot2)

# =========================
# CARGA DE DATOS
# =========================
df <- read_csv("dataset_50k_anonymized.csv",
               locale = locale(encoding = "UTF-8"))

# =========================
# LIMPIEZA
# =========================
df$input <- as.character(df$input)
df$input <- iconv(df$input, from = "UTF-8", to = "ASCII//TRANSLIT")
df$input <- tolower(df$input)
df$input <- gsub("[[:punct:]]", " ", df$input)
df$input <- gsub("[[:digit:]]", " ", df$input)
df$input <- str_squish(df$input)

# =========================
# STOPWORDS
# =========================
mis_stopwords <- data.frame(
  word = c(
    "hola","holi","hey","oye","buenos","dias","tardes","noches",
    "gracias","muchas","muchisimas","agradezco","favor","por","porfavor",
    "si","ok","vale","va","listo","perfecto","claro",
    "bueno","pues","entonces","este","osea","asi",
    "yo","tu","usted","ustedes","nosotros",
    "mi","mis","me","te","se","lo","los","la","las",
    "de","del","que","el","en","y","a","un","una","con",
    "cual","donde","cuando",
    "tengo","tienes","tienen",
    "estoy","esta","estar",
    "quiero","necesito","saber",
    "duda","otra","podria","podrias","puedes","puedo",
    "app","aplicacion"
  )
)

stop_es <- data.frame(word = stopwords("es"))
stop_total <- bind_rows(stop_es, mis_stopwords)

# =========================
# PALABRAS FRECUENTES
# =========================
frecuentes <- df %>%
  unnest_tokens(word, input) %>%
  anti_join(stop_total, by = "word") %>%
  count(word, sort = TRUE)

# =========================
# BIGRAMAS
# =========================
bigramas_limpios <- df %>%
  unnest_tokens(bigram, input, token = "ngrams", n = 2) %>%
  separate(bigram, into = c("w1","w2"), sep = " ") %>%
  filter(!w1 %in% stop_total$word,
         !w2 %in% stop_total$word) %>%
  unite(bigram, w1, w2, sep = " ") %>%
  count(bigram, sort = TRUE)

# =========================
# INTENCIÓN
# =========================
df <- df %>%
  mutate(intencion = case_when(
    str_detect(input, "no puedo|no funciona|error|falla|problema|rechazado|fallo") ~ "queja",
    str_detect(input, "como|cual|donde|puedo|podria|sabes|ayuda") ~ "consulta",
    str_detect(input, "gracias|excelente|bien|rapido") ~ "positivo",
    TRUE ~ "otro"
  ))

# =========================
# PIE CHART
# =========================
conteo_intencion <- df %>%
  count(intencion) %>%
  mutate(pct = n / sum(n),
         label = paste0(intencion, " (", round(pct*100,1), "%)"))

ggplot(conteo_intencion, aes(x = "", y = n, fill = label)) +
  geom_col(width = 1) +
  coord_polar(theta = "y") +
  labs(fill = "Intención") +
  theme_void()

# =========================
# SOLO QUEJAS
# =========================
df_quejas <- df %>%
  filter(intencion == "queja")

# =========================
# CLASIFICACIÓN DE QUEJAS
# =========================
df_quejas <- df_quejas %>%
  mutate(tipo_queja = case_when(
    
    # errores técnicos
    str_detect(input, "error|falla|fallo|problema tecnico") ~ "error tecnico",
    
    # bloqueos
    str_detect(input, "no puedo|no funciona|no sirve|bloqueado") ~ "bloqueo",
    
    # transacciones
    str_detect(input, "transferencia|deposito|no llega|no se refleja") ~ "problemas transferencias",
    
    # tarjetas
    str_detect(input, "tarjeta bloqueada|rechazada|declinada|rechazado") ~ "tarjeta rechazada",
    
    # acceso / login
    str_detect(input, "no puedo entrar|login|acceso|contrasena") ~ "problemas acceso",
    
    # app
    str_detect(input, "app|aplicacion|sistema") ~ "problemas app",
    
    # cargos
    str_detect(input, "cargo no reconocido|cobro|comision") ~ "cargos no reconocidos",
    
    # tiempos
    str_detect(input, "lento|tarda|demora") ~ "lentitud",
    
    str_detect(input, "reembolso") ~ "reembolso",
    
    str_detect(input, "token") ~ "token",
    str_detect(input, "actualizacion") ~ "token",
    
    TRUE ~ "otro"
  ))
top_quejas <- df_quejas %>%
  count(tipo_queja) %>%
  arrange(desc(n))

ggplot(top_quejas, aes(x = reorder(tipo_queja, n), y = n)) +
  geom_col() +
  coord_flip() +
  geom_text(aes(label = n), hjust = -0.2) +
  labs(
    title = "Tipos de Quejas de Usuarios",
    x = "",
    y = "Frecuencia"
  ) +
  theme_minimal() +
  ylim(0, max(top_quejas$n) * 1.2)


write.csv(df_quejas, "quejas_clasificadas.csv", 
          row.names = FALSE, 
          fileEncoding = "UTF-8")
getwd()


bigramas_quejas <- df_quejas %>%
  unnest_tokens(bigram, input, token = "ngrams", n = 2) %>%
  separate(bigram, into = c("w1","w2"), sep = " ") %>%
  filter(!w1 %in% stop_total$word,
         !w2 %in% stop_total$word) %>%
  unite(bigram, w1, w2, sep = " ") %>%
  count(bigram, sort = TRUE)

head(bigramas_quejas, 20)

top_problemas <- bigramas_quejas %>%
  filter(str_detect(bigram, "error|no puedo|no funciona|rechazado|bloqueado")) %>%
  slice_max(n, n = 15)

ggplot(top_problemas, aes(x = reorder(bigram, n), y = n)) +
  geom_col() +
  coord_flip() +
  labs(
    title = "Top Problemas Específicos",
    x = "",
    y = "Frecuencia"
  ) +
  theme_minimal()

otros_quejas <- df_quejas %>%
  filter(tipo_queja == "otro")

write.csv(otros_quejas, "otros_quejas.csv", row.names = FALSE)




# =========================
# LIBRERÍA SENTIMIENTO
# =========================
install.packages("syuzhet")
library(syuzhet)

# =========================
# SOLO CONSULTAS
# =========================
df_consultas <- df %>%
  filter(intencion == "consulta")

# =========================
# CLASIFICACIÓN
# =========================
df_consultas <- df_consultas %>%
  mutate(tipo_consulta = case_when(
    
    # cuentas
    str_detect(input, "abrir cuenta|crear cuenta|cuenta nueva|requisitos") ~ "apertura cuenta",
    str_detect(input, "cancelo|cancelar|cancelacion|eliminar cuenta") ~ "cancelar",
    
    # verificación
    str_detect(input, "verificacion|verificar|selfie|biometrica|ine") ~ "verificacion",
    
    # tarjetas / crédito
    str_detect(input, "tarjeta|credito|tdc|tdd|tasa|interes") ~ "tarjetas/credito",
    
    # transferencias
    str_detect(input, "transferencia|tranferencia|spei|clabe|deposito|enviar dinero|recibir dinero") ~ "transferencias",
    
    # limite / prestamo
    str_detect(input, "limite|prestamo|maximo|credito disponible") ~ "limite/prestamo",
    
    # cashback
    str_detect(input, "cashback|cash back") ~ "cashback",
    
    # divisas / internacional
    str_detect(input, "divisas|dolares|usd|extranjero") ~ "divisas",
    
    # mensualidades
    str_detect(input, "mensualidad|meses|msi") ~ "mensualidades",
    
    # inversiones
    str_detect(input, "inversiones|invertir|fondos|rendimiento|acciones|etf") ~ "inversiones",
    
    # impuestos
    str_detect(input, "impuestos|isr") ~ "impuestos",
    
    # crédito automotriz
    str_detect(input, "automotriz|auto|vehiculo") ~ "credito automotriz",
    
    # app / problemas técnicos
    str_detect(input, "app|aplicacion|sistema|token|notificacion|configuracion|havi|ayuda|nip|correo electronico|bloquearon|error|no funciona|no sirve|no puedo entrar") ~ "problemas app",
    
    # contacto
    str_detect(input, "telefono|contacto") ~ "contacto",
    
    # hablar con asesor
    str_detect(input, "con quien hablar|asesor|humano|persona|con alguien|asesoro|ejecutivo|agente|hablar con") ~ "hablar con asesor",
    
    # eventos / promos
    str_detect(input, "pal norte|ticket|evento|oferta|ofertas|promo|promocion") ~ "eventos/promos",
    
    # saldo
    str_detect(input, "saldo|estado cuenta|cuanto tengo|cuanto debo|movimientos|historial") ~ "consultas saldo",
    
    # retiros
    str_detect(input, "cajero|retirar dinero|retiro|ventanilla|sacar dinero") ~ "retiros/cajeros",
    
    # ubicaciones
    str_detect(input, "sucursal|ubicacion|donde") ~ "ubicaciones",
    
    # viajes
    str_detect(input, "viaje|viajes") ~ "viajes",
    
    # pagos / deuda (NUEVO - MUY IMPORTANTE)
    str_detect(input, "pago|minimo|deuda|adeudo|liquidar|abono") ~ "pagos/deuda",
    
    # pagos digitales (NUEVO)
    str_detect(input, "codi|qr|nfc|wallet|pagar con celular") ~ "pagos digitales",
    
    # claves bancarias (NUEVO - clave para reducir "otro")
    str_detect(input, "swift|bic|iban") ~ "transferencias internacionales",
    
    # terminal / negocio (NUEVO)
    str_detect(input, "terminal|punto de venta|tap to pay|cobrar con celular") ~ "terminal/negocio",
    
    TRUE ~ NA_character_   
  ))

# =========================
# SENTIMENT ANALYSIS
# =========================
df_consultas$sentimiento <- get_sentiment(df_consultas$input, method = "syuzhet")

df_consultas <- df_consultas %>%
  mutate(sentimiento_cat = case_when(
    sentimiento > 0 ~ "positivo",
    sentimiento < 0 ~ "negativo",
    TRUE ~ "neutral"
  ))

sentimiento_tipo <- df_consultas %>%
  group_by(tipo_consulta) %>%
  summarise(promedio = mean(sentimiento)) %>%
  arrange(promedio)


df_consultas %>%
  count(tipo_consulta, sentimiento_cat)

write.csv(df_consultas, "consultas_clasificadas3.csv", 
          row.names = FALSE, 
          fileEncoding = "UTF-8")
getwd()

df_consultas %>%
  count(tipo_consulta, sentimiento_cat) %>%
  group_by(tipo_consulta) %>%
  mutate(pct = n / sum(n)) %>%
  ggplot(aes(x = reorder(tipo_consulta, pct), y = pct, fill = sentimiento_cat)) +
  geom_col() +
  coord_flip() +
  labs(
    title = "Proporción de Sentimiento por Tipo de Consulta",
    x = "",
    y = "Proporción"
  ) +
  theme_minimal()




# =========================
# LIMPIEZA PARA EMOCIONES
# =========================
df_consultas <- df %>%
  mutate(input_clean = str_squish(input))

# =========================
# SENTIMIENTOS + EMOCIONES (TODO EL DATASET)
# =========================

library(syuzhet)

# sentimiento general
df$sentimiento <- get_sentiment(df$input, method = "syuzhet")

df <- df %>%
  mutate(sentimiento_cat = case_when(
    sentimiento > 0 ~ "positivo",
    sentimiento < 0 ~ "negativo",
    TRUE ~ "neutral"
  ))

# =========================
# LIMPIEZA PARA EMOCIONES
# =========================
df <- df %>%
  mutate(input_clean = str_squish(input))

# =========================
# DICCIONARIO DE EMOCIONES (OPTIMIZADO BANCA)
# =========================
emociones_dic <- list(
  
  frustracion = "no funciona|error|fallo|falla|bloqueado|rechazado|no puedo|no sirve|problema|no deja",
  
  urgencia = "urgente|necesito|ya|ahora|rapido|inmediato|no ha llegado|pendiente|cuanto tarda",
  
  confusion = "no entiendo|como funciona|como le hago|que significa|donde veo|no encuentro",
  
  confianza = "gracias|perfecto|excelente|ok|vale|listo|funciono",
  
  interes = "quiero saber|como puedo|me gustaria|informacion|podrias",
  
  miedo = "fraude|robo|no reconocido|cargo indebido|me quitaron dinero|deuda|adeudo"
)

# =========================
# DETECCIÓN DE EMOCIÓN (SOBRE TODO EL DF)
# =========================
df <- df %>%
  rowwise() %>%
  mutate(
    emocion = case_when(
      
      str_detect(input_clean, emociones_dic$frustracion) ~ "frustracion",
      str_detect(input_clean, emociones_dic$urgencia) ~ "urgencia",
      str_detect(input_clean, emociones_dic$miedo) ~ "miedo",
      str_detect(input_clean, emociones_dic$confusion) ~ "confusion",
      str_detect(input_clean, emociones_dic$confianza) ~ "confianza",
      str_detect(input_clean, emociones_dic$interes) ~ "interes",
      
      TRUE ~ "neutral"
    )
  ) %>%
  ungroup()

# =========================
# GRAFICA 1: SENTIMIENTO POR INTENCIÓN
# =========================
df %>%
  count(intencion, sentimiento_cat) %>%
  group_by(intencion) %>%
  mutate(pct = n / sum(n)) %>%
  ggplot(aes(x = intencion, y = pct, fill = sentimiento_cat)) +
  geom_col() +
  labs(
    title = "Sentimiento por tipo de intención",
    x = "Intención",
    y = "Proporción"
  ) +
  theme_minimal()

# =========================
# GRAFICA 2: EMOCIONES POR INTENCIÓN
# =========================
df %>%
  count(intencion, emocion) %>%
  group_by(intencion) %>%
  mutate(pct = n / sum(n)) %>%
  ggplot(aes(x = intencion, y = pct, fill = emocion)) +
  geom_col() +
  labs(
    title = "Distribución de emociones por intención",
    x = "Intención",
    y = "Proporción"
  ) +
  theme_minimal()

# =========================
# GRAFICA 3: FRICCIÓN REAL (LA MÁS IMPORTANTE)
# =========================
df %>%
  mutate(es_negativa = emocion %in% c("frustracion","miedo","urgencia")) %>%
  group_by(intencion) %>%
  summarise(
    total = n(),
    negativas = sum(es_negativa),
    pct_negativas = negativas / total
  ) %>%
  ggplot(aes(x = intencion, y = pct_negativas)) +
  geom_col() +
  labs(
    title = "Fricción por tipo de interacción",
    y = "% emociones negativas",
    x = "Intención"
  ) +
  theme_minimal()

# =========================
# GRAFICA 4: FRICCIÓN POR TIPO DE CONSULTA (MUY CLAVE)
# =========================
df %>%
  filter(intencion == "consulta") %>%
  mutate(es_negativa = emocion %in% c("frustracion","miedo","urgencia")) %>%
  group_by(tipo_consulta) %>%
  summarise(
    total = n(),
    negativas = sum(es_negativa),
    pct_negativas = negativas / total
  ) %>%
  arrange(desc(pct_negativas)) %>%
  ggplot(aes(x = reorder(tipo_consulta, pct_negativas), y = pct_negativas)) +
  geom_col() +
  coord_flip() +
  labs(
    title = "Fricción por tipo de consulta",
    y = "% emociones negativas",
    x = ""
  ) +
  theme_minimal()

# =========================
# EXPORT FINAL
# =========================
write.csv(df, "dataset_con_sentimiento_emociones.csv",
          row.names = FALSE,
          fileEncoding = "UTF-8")







# =========================
# RESET
# =========================
rm(list = ls())

# =========================
# LIBRERÍAS
# =========================
library(readr)
library(dplyr)
library(stringr)
library(tidyr)
library(tidytext)
library(stopwords)
library(ggplot2)
library(syuzhet)

# =========================
# CARGA
# =========================
df <- read_csv("dataset_50k_anonymized.csv",
               locale = locale(encoding = "UTF-8"))

# =========================
# LIMPIEZA
# =========================
df$input <- as.character(df$input)
df$input <- iconv(df$input, from = "UTF-8", to = "ASCII//TRANSLIT")
df$input <- tolower(df$input)
df$input <- gsub("[[:punct:]]", " ", df$input)
df$input <- gsub("[[:digit:]]", " ", df$input)
df$input <- str_squish(df$input)

# =========================
# INTENCIÓN
# =========================
df <- df %>%
  mutate(intencion = case_when(
    str_detect(input, "no puedo|no funciona|error|falla|problema|rechazado|fallo") ~ "queja",
    str_detect(input, "como|cual|donde|puedo|podria|sabes|ayuda") ~ "consulta",
    str_detect(input, "gracias|excelente|bien|rapido") ~ "positivo",
    TRUE ~ "otro"
  ))

# =========================
# SENTIMIENTO
# =========================
df$sentimiento <- get_sentiment(df$input, method = "syuzhet")

df <- df %>%
  mutate(sentimiento_cat = case_when(
    sentimiento > 0 ~ "positivo",
    sentimiento < 0 ~ "negativo",
    TRUE ~ "neutral"
  ))

# =========================
# LIMPIEZA PARA EMOCIONES
# =========================
df <- df %>%
  mutate(input_clean = str_squish(input))

# =========================
# DICCIONARIO EMOCIONES
# =========================
emociones_dic <- list(
  frustracion = "no funciona|error|fallo|falla|bloqueado|rechazado|no puedo|no sirve|problema|no deja",
  urgencia = "urgente|necesito|ya|ahora|rapido|inmediato|no ha llegado|pendiente|cuanto tarda",
  confusion = "no entiendo|como funciona|como le hago|que significa|donde veo|no encuentro",
  confianza = "gracias|perfecto|excelente|ok|vale|listo|funciono",
  interes = "quiero saber|como puedo|me gustaria|informacion",
  miedo = "fraude|robo|no reconocido|cargo indebido|me quitaron dinero|deuda|adeudo"
)

# =========================
# DETECCIÓN EMOCIÓN
# =========================
df <- df %>%
  rowwise() %>%
  mutate(
    emocion = case_when(
      str_detect(input_clean, emociones_dic$frustracion) ~ "frustracion",
      str_detect(input_clean, emociones_dic$urgencia) ~ "urgencia",
      str_detect(input_clean, emociones_dic$miedo) ~ "miedo",
      str_detect(input_clean, emociones_dic$confusion) ~ "confusion",
      str_detect(input_clean, emociones_dic$confianza) ~ "confianza",
      str_detect(input_clean, emociones_dic$interes) ~ "interes",
      TRUE ~ "neutral"
    )
  ) %>%
  ungroup()

# =========================
# SEPARACIÓN
# =========================
df_quejas <- df %>% filter(intencion == "queja")
df_consultas <- df %>% filter(intencion == "consulta")

# =========================
# CLASIFICACIÓN QUEJAS
# =========================
df_quejas <- df_quejas %>%
  mutate(tipo_queja = case_when(
    str_detect(input, "error|falla|fallo") ~ "error tecnico",
    str_detect(input, "no puedo|no funciona|bloqueado") ~ "bloqueo",
    str_detect(input, "transferencia|deposito|no llega") ~ "problemas transferencias",
    str_detect(input, "tarjeta.*rechaz|declin") ~ "tarjeta rechazada",
    str_detect(input, "login|acceso|contrasena") ~ "problemas acceso",
    str_detect(input, "app|aplicacion") ~ "problemas app",
    str_detect(input, "cobro|comision|cargo") ~ "cargos no reconocidos",
    str_detect(input, "lento|tarda") ~ "lentitud",
    str_detect(input, "reembolso") ~ "reembolso",
    str_detect(input, "token") ~ "token",
    TRUE ~ "otro"
  ))

# =========================
# CLASIFICACIÓN CONSULTAS
# =========================
df_consultas <- df_consultas %>%
  mutate(tipo_consulta = case_when(
    str_detect(input, "abrir cuenta|crear cuenta") ~ "apertura cuenta",
    str_detect(input, "cancelar") ~ "cancelar",
    str_detect(input, "verificacion|ine") ~ "verificacion",
    str_detect(input, "tarjeta|credito") ~ "tarjetas/credito",
    str_detect(input, "transferencia|spei") ~ "transferencias",
    str_detect(input, "limite|prestamo") ~ "limite/prestamo",
    str_detect(input, "cashback") ~ "cashback",
    str_detect(input, "divisas|dolares") ~ "divisas",
    str_detect(input, "meses|msi") ~ "mensualidades",
    str_detect(input, "inversion") ~ "inversiones",
    str_detect(input, "impuestos") ~ "impuestos",
    str_detect(input, "auto|vehiculo") ~ "credito automotriz",
    str_detect(input, "app|error|no funciona") ~ "problemas app",
    str_detect(input, "telefono|contacto") ~ "contacto",
    str_detect(input, "asesor|humano") ~ "hablar con asesor",
    str_detect(input, "evento|ticket") ~ "eventos/promos",
    str_detect(input, "saldo|estado cuenta") ~ "consultas saldo",
    str_detect(input, "cajero|retiro") ~ "retiros/cajeros",
    str_detect(input, "sucursal") ~ "ubicaciones",
    str_detect(input, "viaje") ~ "viajes",
    TRUE ~ NA_character_
  ))

# =========================
# SENTIMIENTO EN QUEJAS
# =========================
df_quejas %>%
  count(tipo_queja, sentimiento_cat) %>%
  group_by(tipo_queja) %>%
  mutate(pct = n/sum(n)) %>%
  ggplot(aes(x = tipo_queja, y = pct, fill = sentimiento_cat)) +
  geom_col() +
  coord_flip() +
  labs(title = "Sentimiento en Quejas", y = "Proporción") +
  theme_minimal()

# =========================
# SENTIMIENTO EN CONSULTAS
# =========================
df_consultas %>%
  filter(!is.na(tipo_consulta)) %>%
  count(tipo_consulta, sentimiento_cat) %>%
  group_by(tipo_consulta) %>%
  mutate(pct = n/sum(n)) %>%
  ggplot(aes(x = tipo_consulta, y = pct, fill = sentimiento_cat)) +
  geom_col() +
  coord_flip() +
  labs(title = "Sentimiento en Consultas", y = "Proporción") +
  theme_minimal()

# =========================
# FRICCIÓN QUEJAS
# =========================
df_quejas %>%
  count(tipo_queja, emocion) %>%
  group_by(tipo_queja) %>%
  mutate(pct = n/sum(n)) %>%
  ggplot(aes(x = tipo_queja, y = pct, fill = emocion)) +
  geom_col() +
  coord_flip() +
  labs(
    title = "Emociones en Quejas",
    x = "",
    y = "Proporción",
    fill = "Emoción"
  ) +
  theme_minimal()

# =========================
# FRICCIÓN CONSULTAS
# =========================
df_consultas %>%
  filter(!is.na(tipo_consulta)) %>%
  count(tipo_consulta, emocion) %>%
  group_by(tipo_consulta) %>%
  mutate(pct = n/sum(n)) %>%
  ggplot(aes(x = tipo_consulta, y = pct, fill = emocion)) +
  geom_col() +
  coord_flip() +
  labs(
    title = "Emociones en Consultas",
    x = "",
    y = "Proporción",
    fill = "Emoción"
  ) +
  theme_minimal()




df$emocion <- factor(
  df$emocion,
  levels = c("frustracion","urgencia","miedo","confusion","interes","confianza","neutral")
)

df_quejas$emocion <- factor(df_quejas$emocion, levels = levels(df$emocion))
df_consultas$emocion <- factor(df_consultas$emocion, levels = levels(df$emocion))

colores_emocion <- c(
  "frustracion" = "#d73027",  # rojo fuerte
  "urgencia"    = "#fc8d59",
  "miedo"       = "#7b3294",
  "confusion"   = "#4575b4",
  "interes"     = "#91cf60",
  "confianza"   = "#1a9850",
  "neutral"     = "gray70"
)

df_consultas %>%
  filter(emocion %in% c("frustracion","urgencia","miedo")) %>%
  count(tipo_consulta, emocion) %>%
  ggplot(aes(x = tipo_consulta, y = n, fill = emocion)) +
  geom_col(position = "fill") +
  coord_flip() +
  labs(
    title = "Fricción emocional por tipo de consulta",
    y = "Proporción",
    x = "",
    fill = "Emoción negativa"
  ) +
  scale_fill_manual(values = colores_emocion) +
  theme_minimal()



top_dolores <- df_consultas %>%
  filter(!is.na(tipo_consulta)) %>%
  mutate(es_negativa = emocion %in% c("frustracion","miedo","urgencia")) %>%
  group_by(tipo_consulta) %>%
  summarise(
    volumen = n(),
    friccion = mean(es_negativa)
  ) %>%
  arrange(desc(friccion))

head(top_dolores, 10)

top_volumen <- df_consultas %>%
  count(tipo_consulta) %>%
  arrange(desc(n))

head(top_volumen, 10)


impacto <- df_consultas %>%
  filter(!is.na(tipo_consulta)) %>%
  mutate(es_negativa = emocion %in% c("frustracion","miedo","urgencia")) %>%
  group_by(tipo_consulta) %>%
  summarise(
    volumen = n(),
    friccion = mean(es_negativa)
  )

ggplot(impacto, aes(x = volumen, y = friccion, label = tipo_consulta)) +
  geom_point(size = 3) +
  geom_text(nudge_y = 0.02) +
  labs(
    title = "Mapa de impacto: Volumen vs Fricción",
    x = "Volumen de consultas",
    y = "% fricción"
  ) +
  theme_minimal()


emociones_top <- df %>%
  count(emocion) %>%
  arrange(desc(n))

emociones_top

drivers_emocion <- df_consultas %>%
  filter(emocion %in% c("frustracion","miedo","urgencia")) %>%
  count(tipo_consulta, emocion) %>%
  arrange(desc(n))

head(drivers_emocion, 15)

quick_wins <- impacto %>%
  filter(
    volumen > median(volumen),
    friccion > median(friccion)
  ) %>%
  arrange(desc(friccion))

quick_wins

impacto <- impacto %>%
  mutate(score = volumen * friccion) %>%
  arrange(desc(score))