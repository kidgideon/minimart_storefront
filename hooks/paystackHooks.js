const BASE_URL = "https://minimart-backend.vercel.app/api/paystack";
const test_url = "http://localhost:3400/api/paystack"


// Initialize payment with split code
export async function payWithSplitCode({ email, amount, split_code, reference, callback_url }) {
  const res = await fetch(`${test_url}/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, amount, split_code, reference, callback_url }),
  });

  const data = await res.json();
  if (!data.status) throw new Error("Failed to initialize payment");
  return data.data; // Contains authorization_url, access_code, reference, etc.
}

