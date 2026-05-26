import React, { useState, useEffect } from "react";
import { PlusCircle, BarChart3, TrendingUp, DollarSign, Eye, EyeOff, LayoutGrid, Calendar, Percent } from "lucide-react";

export default function SalesTracker({ userId = "default", initialLogs = [], onComplete, isCompleted }) {
  const storageKey = `shark_sales_logs_${userId}`;
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : initialLogs;
  });

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [doors, setDoors] = useState("");
  const [pitches, setPitches] = useState("");
  const [leads, setLeads] = useState("");
  const [closed, setClosed] = useState("");
  const [revenue, setRevenue] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(logs));
  }, [logs, storageKey]);

  // Aggregate stats
  const totalDoors = logs.reduce((sum, item) => sum + Number(item.doors || 0), 0);
  const totalPitches = logs.reduce((sum, item) => sum + Number(item.pitches || 0), 0);
  const totalLeads = logs.reduce((sum, item) => sum + Number(item.leads || 0), 0);
  const totalClosed = logs.reduce((sum, item) => sum + Number(item.closed || 0), 0);
  const totalRevenue = logs.reduce((sum, item) => sum + Number(item.revenue || 0), 0);

  // Conversion Rates
  const knockToPitch = totalDoors > 0 ? ((totalPitches / totalDoors) * 100).toFixed(1) : 0;
  const pitchToLead = totalPitches > 0 ? ((totalLeads / totalPitches) * 100).toFixed(1) : 0;
  const leadToDeal = totalLeads > 0 ? ((totalClosed / totalLeads) * 100).toFixed(1) : 0;

  // 1099 Commission calculation (Simulating 20% standard commission)
  const repCommission = (totalRevenue * 0.20).toFixed(2);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!doors || !pitches || !leads || !closed || !revenue) return;

    const newLog = {
      date,
      doors: parseInt(doors, 10),
      pitches: parseInt(pitches, 10),
      leads: parseInt(leads, 10),
      closed: parseInt(closed, 10),
      revenue: parseInt(revenue, 10)
    };

    // Prepend new log and close form
    setLogs([newLog, ...logs]);
    setDoors("");
    setPitches("");
    setLeads("");
    setClosed("");
    setRevenue("");
    setShowAddForm(false);
  };

  // Find max revenue in logs to scale the bar chart
  const maxRevenue = Math.max(...logs.map(l => l.revenue), 100);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center pb-3 border-b border-navy-border/60">
        <div>
          <h3 className="font-display text-xl font-bold flex items-center gap-2">
            <TrendingUp className="text-orange w-6 h-6" />
            D2D Performance Tracking Dashboard
          </h3>
          <p className="text-xs text-text-secondary">Log doors knocked, track conversion percentages, and monitor your 1099 sales commission.</p>
        </div>
        
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn btn-accent flex items-center gap-1 text-xs"
        >
          <PlusCircle className="w-4 h-4" />
          {showAddForm ? "Hide Form" : "Log Daily Doors"}
        </button>
      </div>

      {/* Aggregate Stats Row */}
      <div className="grid-4">
        <div className="glass-card stat-card orange-hover">
          <div className="stat-icon orange">
            <DollarSign className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <h4>Total Revenue Booked</h4>
            <p className="text-white">${totalRevenue.toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <h4>1099 Commissions (20%)</h4>
            <p className="text-orange">${Number(repCommission).toLocaleString()}</p>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon success">
            <LayoutGrid className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <h4>Total Doors Knocked</h4>
            <p className="text-white">{totalDoors}</p>
          </div>
        </div>

        <div className="glass-card stat-card">
          <div className="stat-icon text-[#c084fc] bg-[#c084fc]/10">
            <Calendar className="w-5 h-5" />
          </div>
          <div className="stat-info">
            <h4>Total Jobs Closed</h4>
            <p className="text-white">{totalClosed} sales</p>
          </div>
        </div>
      </div>

      {/* Log Input Form */}
      {showAddForm && (
        <form onSubmit={handleSubmit} className="glass-card p-5 border-orange bg-orange/5 animate-fade-in space-y-4">
          <h4 className="font-display font-bold text-sm uppercase text-orange mb-3 flex items-center gap-2">
            <PlusCircle className="w-4 h-4" /> Log Daily Door-to-Door Pitch Metrics
          </h4>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Date</label>
              <input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
                className="form-input form-input-orange"
                required
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Doors Knocked</label>
              <input 
                type="number" 
                placeholder="e.g. 50"
                value={doors} 
                min={0}
                onChange={(e) => setDoors(e.target.value)}
                className="form-input form-input-orange"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Pitches Made</label>
              <input 
                type="number" 
                placeholder="e.g. 25"
                value={pitches} 
                min={0}
                onChange={(e) => setPitches(e.target.value)}
                className="form-input form-input-orange"
                required
              />
            </div>
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Leads Generated</label>
              <input 
                type="number" 
                placeholder="e.g. 10"
                value={leads} 
                min={0}
                onChange={(e) => setLeads(e.target.value)}
                className="form-input form-input-orange"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Deals Closed</label>
              <input 
                type="number" 
                placeholder="e.g. 4"
                value={closed} 
                min={0}
                onChange={(e) => setClosed(e.target.value)}
                className="form-input form-input-orange"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Day Revenue ($)</label>
              <input 
                type="number" 
                placeholder="e.g. 850"
                value={revenue} 
                min={0}
                onChange={(e) => setRevenue(e.target.value)}
                className="form-input form-input-orange"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button 
              type="button" 
              onClick={() => setShowAddForm(false)} 
              className="btn btn-outline btn-secondary text-xs"
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-accent text-xs">
              Save Entry
            </button>
          </div>
        </form>
      )}

      {/* Conversion rates + Chart Grid */}
      <div className="grid-2">
        {/* Conversion Ratios Panel */}
        <div className="glass-card p-5 space-y-4">
          <h4 className="font-display font-bold text-sm text-sky-blue uppercase tracking-wide flex items-center gap-2 mb-3">
            <Percent className="w-4 h-4 text-sky-blue" />
            Conversion Performance Ratios
          </h4>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">Knock to Pitch Efficiency</span>
                <span className="text-white font-bold">{knockToPitch}%</span>
              </div>
              <div className="w-full bg-navy-dark h-2 rounded-full overflow-hidden">
                <div className="bg-sky-blue h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(knockToPitch, 100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">Pitch to Lead Qualification</span>
                <span className="text-white font-bold">{pitchToLead}%</span>
              </div>
              <div className="w-full bg-navy-dark h-2 rounded-full overflow-hidden">
                <div className="bg-[#a855f7] h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(pitchToLead, 100)}%` }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-text-secondary">Lead to Deal Close Rate</span>
                <span className="text-white font-bold">{leadToDeal}%</span>
              </div>
              <div className="w-full bg-navy-dark h-2 rounded-full overflow-hidden">
                <div className="bg-orange h-full rounded-full transition-all duration-500" style={{ width: `${Math.min(leadToDeal, 100)}%` }} />
              </div>
            </div>
          </div>
        </div>

        {/* Animated Bar Chart Panel */}
        <div className="glass-card p-5 flex flex-col">
          <h4 className="font-display font-bold text-sm text-orange uppercase tracking-wide flex items-center gap-2 mb-4">
            <BarChart3 className="w-4 h-4 text-orange" />
            Daily Revenue Breakdown
          </h4>

          {logs.length === 0 ? (
            <div className="flex-1 flex items-center justify-center text-text-muted text-xs">
              No historical data available yet. Start logging doors!
            </div>
          ) : (
            <div className="flex-grow flex items-end justify-between gap-2 h-40 pt-4 px-2">
              {logs.slice(0, 7).reverse().map((item, idx) => {
                const heightPercent = (item.revenue / maxRevenue) * 90;
                return (
                  <div key={idx} className="flex flex-col items-center flex-grow group">
                    <div className="text-[9px] font-mono text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200 mb-1">
                      ${item.revenue}
                    </div>
                    {/* Bar */}
                    <div 
                      className="w-full bg-gradient-to-t from-orange/30 to-orange hover:from-sky-blue/30 hover:to-sky-blue rounded-t transition-all duration-300 relative"
                      style={{ 
                        height: `${Math.max(heightPercent, 5)}px`,
                        backgroundColor: "var(--orange)"
                      }}
                    >
                      <div className="absolute inset-0 bg-sky-blue opacity-0 hover:opacity-100 transition-opacity duration-300 rounded-t" />
                    </div>
                    {/* Date stamp */}
                    <span className="text-[8px] font-mono text-text-secondary mt-1.5 transform rotate-[-20deg]">
                      {item.date.slice(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {!isCompleted && logs.length > 0 && (
        <div className="flex justify-end">
          <button type="button" onClick={() => onComplete?.()} className="btn btn-accent text-sm">
            Complete sales tracker step
          </button>
        </div>
      )}

      {/* Historical Logs List */}
      <div className="glass-card p-5">
        <h4 className="font-display font-bold text-sm text-white mb-3">Historical Door Logging Entries</h4>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-navy-border/60 text-text-secondary font-mono">
                <th className="py-2.5">Date</th>
                <th className="py-2.5">Doors</th>
                <th className="py-2.5">Pitches</th>
                <th className="py-2.5">Leads</th>
                <th className="py-2.5">Deals Closed</th>
                <th className="py-2.5 text-right">Commission (20%)</th>
                <th className="py-2.5 text-right">Total Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-border/30 text-text-primary">
              {logs.map((item, idx) => (
                <tr key={idx} className="hover:bg-navy-light/20 transition-colors">
                  <td className="py-2.5 font-mono text-text-secondary">{item.date}</td>
                  <td className="py-2.5">{item.doors} doors</td>
                  <td className="py-2.5">{item.pitches} pitches</td>
                  <td className="py-2.5">{item.leads} leads</td>
                  <td className="py-2.5 font-semibold text-success">{item.closed} sales</td>
                  <td className="py-2.5 text-right text-orange font-mono font-medium">${(item.revenue * 0.20).toFixed(0)}</td>
                  <td className="py-2.5 text-right font-mono font-bold text-white">${item.revenue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
