export const createPayment = async (projectId: number, clientEmail: string) => {
  const response = await fetch("/api/create-payment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ projectId, clientEmail }),
  });

  if (!response.ok) {
    throw new Error("Failed to create payment");
  }

  return response.json();
};

export const confirmPayment = async (paymentId: string) => {
  const response = await fetch("/api/payments/confirm", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ paymentId }),
  });

  if (!response.ok) {
    throw new Error("Failed to confirm payment");
  }

  return response.json();
};
