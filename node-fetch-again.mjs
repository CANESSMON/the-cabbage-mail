async function check() {
  const res = await fetch('https://emailbhejo-backend.onrender.com/api/v1/domains/verify-dns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer dev_token_123' },
    body: JSON.stringify({ domainName: 'auqanix.com' })
  });
  const data = await res.text();
  console.log('Status:', res.status);
  console.log('Data:', data);
}
check();
