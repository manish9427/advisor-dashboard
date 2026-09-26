import { NextResponse } from 'next/server';

export async function GET() {
  const data = {
    user: "Palash",
    date: "MONDAY, SEPTEMBER 7",
    stats: { clients: 18, bookValue: "₹796 CR BOOK" },
    todaysBrief: {
      label: "TODAY'S BRIEF · 09:42 IST",
      text: "Three clients need a conversation before market open. Rahul first — small-cap drift +6%.",
      actions: ["Call Rahul", "EV report → Anita", "Rebalance Varun"]
    },
    clientsNeedingAttention: {
      count: 5,
      cards: [
        {
          initials: "RM",
          name: "Rahul Mehta",
          aum: "₹3.2 Cr",
          badge: "DRIFT +6%",
          badgeColor: "red",
          note: "Small-cap drift +6% pushing volatility above risk mandate. Allocation brief overdue.",
          meta: "30d Ret: -6.0% · 2d ago",
          cta: "Call Now"
        },
        {
          initials: "PV",
          name: "Priya Venkat",
          aum: "₹4.6 Cr",
          badge: "MEETING IN 47M",
          badgeColor: "green",
          note: "Meeting at 11:30. Tier-1 NPS tax optimization inquiry pending from previous review.",
          meta: "Fit: 92% · Last met 11 Apr",
          cta: "Open Brief"
        },
        {
          initials: "VK",
          name: "Varun Kapoor",
          aum: "₹7.1 Cr",
          badge: "OVERWEIGHT +9%",
          badgeColor: "yellow",
          note: "Mid-cap overweight +9% with 16 days of inactivity. High risk of relationship coldness.",
          meta: "30d Ret: -9.2% · 16d ago",
          cta: "Rebalance"
        },
        {
          initials: "AS",
          name: "Anita Shah",
          aum: "₹5.8 Cr",
          badge: null,
          note: "EV & Green Energy report drafted and waiting...",
          meta: null,
          cta: null
        }
      ]
    },
    rmHeartbeat: {
      label: "RM HEARTBEAT",
      badge: "ACTIVE BOOK",
      clients: 18,
      holdings: 52,
      flagged: 3,
      totalAum: "₹796 Cr",
      aumChange: "+₹14 Cr · +3.2% vs 7d ago",
      filters: ["All", "Equity", "Debt", "Mutual Funds", "REITs", "Alerts Only"],
      note: "Graph is a force-directed node visualization: RM (advisor) nodes connect to Client nodes, which connect to Asset/Holding nodes (Equity, Mutual Funds, Debt & Cash, REITs, individual stocks/funds). Node size ~ AUM, color ~ asset type. Treat as a bonus/stretch item — see scope note in brief."
    }
  };

  return NextResponse.json(data);
}