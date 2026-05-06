"use client";

import { useState } from "react";

export default function Home() {
  const [sold, setSold] = useState(20);
  const [days, setDays] = useState(10);

  const basePrice = 3000;

  const calculatePrice = () => {
    let price = basePrice;
    let remaining = 100 - sold;

    if (sold > 30) price *= 1.1;
    if (sold > 50) price *= 1.15;
    if (sold > 70) price *= 1.25;

    if (days < 7) price *= 1.1;
    if (days < 2) price *= 1.2;

    if (remaining < 30) price *= 1.2;

    return Math.round(price);
  };

  const price = calculatePrice();

  return (
    <div style={{ fontFamily: "sans-serif", padding: 40 }}>
      <h1>Dynamic Ticket Pricing Demo</h1>

      <h2>Spartak vs CSKA</h2>

      <p>Base price: {basePrice} ₽</p>
      <p><b>Current price: {price} ₽</b></p>
      <p>Growth: +{Math.round(((price / basePrice) - 1) * 100)}%</p>

      <hr />

      <div>
        <label>Tickets sold: {sold}%</label><br/>
        <input
          type="range"
          min="0"
          max="100"
          value={sold}
          onChange={(e) => setSold(Number(e.target.value))}
        />
      </div>

      <div style={{ marginTop: 20 }}>
        <label>Days to match: {days}</label><br/>
        <input
          type="range"
          min="0"
          max="30"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        />
      </div>
    </div>
  );
}