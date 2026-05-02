import express from "express";
import axios from "axios";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());

// 🔐 VARIABLES DE ENTORNO
const MP_ACCESS_TOKEN = process.env.MP_ACCESS_TOKEN;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

// 🔌 CLIENTE SUPABASE (IMPORTANTE: SERVICE ROLE)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// 🧠 FUNCIÓN: guardar pago
async function savePayment(payment) {
  const data = {
    id: payment.id,
    subscription_id: payment.preapproval_id,
    amount: payment.transaction_amount,
    status: payment.status,
    created_at: payment.date_created
  };

  const { error } = await supabase
    .from("payments")
    .upsert(data);

  if (error) {
    console.error("Error guardando pago:", error);
  } else {
    console.log("Pago guardado:", data.id);
  }
}

// 🧠 FUNCIÓN: guardar suscripción
async function saveSubscription(sub) {
  const data = {
    id: sub.id,
    plan_id: sub.preapproval_plan_id,
    status: sub.status,
    amount: sub.auto_recurring?.transaction_amount,
    created_at: sub.date_created
  };

  const { error } = await supabase
    .from("subscriptions")
    .upsert(data);

  if (error) {
    console.error("Error guardando suscripción:", error);
  } else {
    console.log("Suscripción guardada:", data.id);
  }
}

// 🚨 WEBHOOK PRINCIPAL
app.post("/webhook", async (req, res) => {

  const { type, data } = req.body;

  console.log("Webhook recibido:", type, data?.id);

  try {

    // 🔵 PAGOS
    if (type === "payment") {

      const response = await axios.get(
        `https://api.mercadopago.com/v1/payments/${data.id}`,
        {
          headers: {
            Authorization: `Bearer ${MP_ACCESS_TOKEN}`
          }
        }
      );

      const payment = response.data;

      // SOLO PAGOS APROBADOS
      if (payment.status === "approved") {
        await savePayment(payment);
      } else {
        console.log("Pago no aprobado:", payment.status);
      }
    }

    // 🟢 SUSCRIPCIONES
    if (type === "subscription_preapproval") {

      const response = await axios.get(
        `https://api.mercadopago.com/preapproval/${data.id}`,
        {
          headers: {
            Authorization: `Bearer ${MP_ACCESS_TOKEN}`
          }
        }
      );

      const sub = response.data;

      await saveSubscription(sub);
    }

    res.sendStatus(200);

  } catch (error) {
    console.error("Error en webhook:", error.message);
    res.sendStatus(500);
  }
});

// 📊 ENDPOINT DE MÉTRICAS (para tu landing)
app.get("/stats", async (req, res) => {

  try {

    // TOTAL RECAUDADO
    const { data: payments } = await supabase
      .from("payments")
      .select("amount");

    // MIEMBROS ACTIVOS
    const { data: subs } = await supabase
      .from("subscriptions")
      .select("id")
      .eq("status", "authorized");

    const total = payments.reduce((acc, p) => acc + (p.amount || 0), 0);

    res.json({
      total,
      miembros: subs.length,
      objetivo: 1000000
    });

  } catch (error) {
    console.error("Error en stats:", error);
    res.status(500).json({ error: "Error obteniendo métricas" });
  }
});

// 🧪 HEALTH CHECK
app.get("/", (req, res) => {
  res.send("Servidor Valor.AR activo");
});

// 🚀 INICIAR SERVIDOR
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
