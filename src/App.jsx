import { useState, useMemo } from 'react'

// âââ SEED DATA âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const TECHS = [
  { id: 'JM', name: 'Jake M.',  color: '#3B82F6' },
  { id: 'RT', name: 'Rosa T.',  color: '#A855F7' },
  { id: 'DC', name: 'Devon C.', color: '#22C55E' },
  { id: 'PS', name: 'Priya S.', color: '#F97316' },
]

const CUSTOMERS_SEED = [
  {
    id: 1, name: 'Anderson Residence', type: 'Residential',
    address: '1234 Maple St, Vancouver BC V6B 1A1', phone: '604-555-0101',
    email: 'h.anderson@email.com',
    equipment: [
      { id: 1, type: 'HVAC', brand: 'Lennox', model: 'XC21', year: 2019, serial: 'LX219034' },
    ],
    lastService: '2026-01-15', nextDue: '2026-07-15',
  },
  {
    id: 2, name: 'Westside Coffee Co.', type: 'Commercial',
    address: '890 Granville St, Vancouver BC V6Z 1K3', phone: '604-555-0202',
    email: 'ops@westsidecoffee.ca',
    equipment: [
      { id: 2, type: 'Plumbing', brand: 'Navien', model: 'NPE-240A', year: 2021, serial: 'NV21887' },
      { id: 3, type: 'HVAC',     brand: 'Carrier', model: '24ACC636', year: 2020, serial: 'CR20445' },
    ],
    lastService: '2026-03-10', nextDue: '2026-06-10',
  },
  {
    id: 3, name: 'Chen Family Home', type: 'Residential',
    address: '567 Oak Ave, Burnaby BC V5H 2C3', phone: '604-555-0303',
    email: 'mchen@gmail.com',
    equipment: [
      { id: 4, type: 'Electrical', brand: 'Siemens', model: '200A Panel', year: 2018, serial: 'SM18002' },
    ],
    lastService: '2025-11-20', nextDue: '2026-11-20',
  },
  {
    id: 4, name: 'Pacific Dental Clinic', type: 'Commercial',
    address: '2100 W 42nd Ave, Vancouver BC V6M 2B4', phone: '604-555-0404',
    email: 'admin@pacificdental.ca',
    equipment: [
      { id: 5, type: 'HVAC',     brand: 'Trane',  model: 'XR15',    year: 2022, serial: 'TR22991' },
      { id: 6, type: 'Plumbing', brand: 'Rheem',  model: 'PROG50',  year: 2020, serial: 'RH20334' },
    ],
    lastService: '2026-02-28', nextDue: '2026-08-28',
  },
  {
    id: 5, name: 'Martinez Condo', type: 'Residential',
    address: '1050 Burrard St #2205, Vancouver BC V6Z 2S3', phone: '604-555-0505',
    email: 'l.martinez@hotmail.com',
    equipment: [
      { id: 7, type: 'HVAC', brand: 'Mitsubishi', model: 'MSZ-GL12', year: 2023, serial: 'MT23771' },
    ],
    lastService: '2026-04-01', nextDue: '2026-10-01',
  },
  {
    id: 6, name: 'Northview Elementary', type: 'Commercial',
    address: '3400 Boundary Rd, Burnaby BC V5M 3Z8', phone: '604-555-0606',
    email: 'facilities@northview.sd41.ca',
    equipment: [
      { id: 8, type: 'HVAC',      brand: 'York',     model: 'YXV',       year: 2017, serial: 'YK17088' },
      { id: 9, type: 'Electrical', brand: 'Square D', model: '400A Panel', year: 2017, serial: 'SD17005' },
    ],
    lastService: '2026-01-08', nextDue: '2026-07-08',
  },
]

const JOB_TYPES = {
  HVAC_SERVICE: { label: 'HVAC Service', icon: 'âï¸',  color: 'bg-blue-100 text-blue-800'   },
  HVAC_INSTALL: { label: 'HVAC Install', icon: 'ð§',  color: 'bg-indigo-100 text-indigo-800' },
  PLUMBING:     { label: 'Plumbing',     icon: 'ð©',  color: 'bg-cyan-100 text-cyan-800'    },
  ELECTRICAL:   { label: 'Electrical',   icon: 'â¡',  color: 'bg-yellow-100 text-yellow-800' },
  INSPECTION:   { label: 'Inspection',   icon: 'ð',  color: 'bg-gray-100 text-gray-800'    },
}

const STATUSES = ['Scheduled', 'En Route', 'In Progress', 'Complete', 'Invoiced']

const STATUS_COLORS = {
  Scheduled:    'bg-slate-100  text-slate-700  border-slate-200',
  'En Route':   'bg-blue-100   text-blue-700   border-blue-200',
  'In Progress':'bg-yellow-100 text-yellow-700 border-yellow-200',
  Complete:     'bg-green-100  text-green-700  border-green-200',
  Invoiced:     'bg-purple-100 text-purple-700 border-purple-200',
}

const today    = new Date('2026-05-03')
const fmt      = d  => d.toISOString().split('T')[0]
const addDays  = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r }

const JOBS_SEED = [
  {
    id: 1, type: 'HVAC_SERVICE', customerId: 1, techId: 'JM',
    status: 'Complete', scheduledDate: fmt(addDays(today, -3)),
    address: '1234 Maple St, Vancouver BC',
    description: 'Annual AC maintenance and filter replacement',
    arrivedAt: '2026-04-30 09:15', completedAt: '2026-04-30 11:45',
    workflow: {
      step: 5, arrived: '2026-04-30 09:15',
      diagnoseNotes: 'Filters clogged, refrigerant slightly low. Cleaned coils.',
      diagnoseCategory: 'Maintenance',
      lineItems: [
        { id: 1, description: 'AC Filter 16Ã20 (2-pack)',  qty: 1,   unitPrice: 36  },
        { id: 2, description: 'Refrigerant R-410A (1 lb)', qty: 1,   unitPrice: 45  },
        { id: 3, description: 'Labour',                    qty: 2.5, unitPrice: 95  },
      ],
      completionNote: 'System running well. Recommend replacing capacitor next visit.',
      invoiced: false,
    },
    invoiceAmount: null,
  },
  {
    id: 2, type: 'PLUMBING', customerId: 2, techId: 'RT',
    status: 'Invoiced', scheduledDate: fmt(addDays(today, -7)),
    address: '890 Granville St, Vancouver BC',
    description: 'Tankless water heater descaling service',
    arrivedAt: '2026-04-26 10:00', completedAt: '2026-04-26 12:30',
    workflow: {
      step: 5, arrived: '2026-04-26 10:00',
      diagnoseNotes: 'Heavy calcium buildup in heat exchanger. Performed descaling flush.',
      diagnoseCategory: 'Maintenance',
      lineItems: [
        { id: 1, description: 'Descaling Solution (4 L)', qty: 1, unitPrice: 55 },
        { id: 2, description: 'Labour',                   qty: 2, unitPrice: 95 },
      ],
      completionNote: 'Unit flushed and tested. Flow rate restored to spec.',
      invoiced: true,
    },
    invoiceAmount: 245,
  },
  {
    id: 3, type: 'ELECTRICAL', customerId: 3, techId: 'DC',
    status: 'In Progress', scheduledDate: fmt(today),
    address: '567 Oak Ave, Burnaby BC',
    description: 'EV charger rough-in & panel inspection',
    arrivedAt: fmt(today) + ' 08:30', completedAt: null,
    workflow: {
      step: 3, arrived: fmt(today) + ' 08:30',
      diagnoseNotes: 'Existing 200A panel adequate. Planning 50A dedicated circuit for Level-2 EVSE in garage.',
      diagnoseCategory: 'Installation',
      lineItems: [
        { id: 1, description: '50A Double-Pole Breaker', qty: 1,  unitPrice: 85   },
        { id: 2, description: '6 AWG Wire (50 ft)',      qty: 50, unitPrice: 2.20 },
        { id: 3, description: 'NEMA 14-50 Outlet',       qty: 1,  unitPrice: 35   },
        { id: 4, description: 'Labour',                  qty: 4,  unitPrice: 110  },
      ],
      completionNote: '',
      invoiced: false,
    },
    invoiceAmount: null,
  },
  {
    id: 4, type: 'HVAC_SERVICE', customerId: 4, techId: 'PS',
    status: 'En Route', scheduledDate: fmt(today),
    address: '2100 W 42nd Ave, Vancouver BC',
    description: 'Commercial HVAC quarterly maintenance',
    arrivedAt: null, completedAt: null,
    workflow: {
      step: 1, arrived: null,
      diagnoseNotes: '', diagnoseCategory: '',
      lineItems: [], completionNote: '', invoiced: false,
    },
    invoiceAmount: null,
  },
  {
    id: 5, type: 'HVAC_INSTALL', customerId: 5, techId: 'JM',
    status: 'Scheduled', scheduledDate: fmt(addDays(today, 2)),
    address: '1050 Burrard St #2205, Vancouver BC',
    description: 'Mini-split installation â living room unit',
    arrivedAt: null, completedAt: null,
    workflow: {
      step: 1, arrived: null,
      diagnoseNotes: '', diagnoseCategory: '',
      lineItems: [], completionNote: '', invoiced: false,
    },
    invoiceAmount: null,
  },
  {
    id: 6, type: 'INSPECTION', customerId: 6, techId: 'RT',
    status: 'Scheduled', scheduledDate: fmt(addDays(today, 1)),
    address: '3400 Boundary Rd, Burnaby BC',
    description: 'Annual HVAC & electrical systems inspection',
    arrivedAt: null, completedAt: null,
    workflow: {
      step: 1, arrived: null,
      diagnoseNotes: '', diagnoseCategory: '',
      lineItems: [], completionNote: '', invoiced: false,
    },
    invoiceAmount: null,
  },
  {
    id: 7, type: 'PLUMBING', customerId: 1, techId: 'DC',
    status: 'Invoiced', scheduledDate: fmt(addDays(today, -14)),
    address: '1234 Maple St, Vancouver BC',
    description: 'Hot water tank replacement',
    arrivedAt: '2026-04-19 11:00', completedAt: '2026-04-19 15:00',
    workflow: {
      step: 5, arrived: '2026-04-19 11:00',
      diagnoseNotes: 'Old 40-gal tank: failed anode rod, heavy sediment. Replaced with 50-gal Rheem.',
      diagnoseCategory: 'Replacement',
      lineItems: [
        { id: 1, description: 'Rheem 50-gal Water Heater', qty: 1, unitPrice: 650 },
        { id: 2, description: 'Expansion Tank',            qty: 1, unitPrice: 45  },
        { id: 3, description: 'Labour',                    qty: 4, unitPrice: 95  },
      ],
      completionNote: 'New unit installed and tested. Showed customer maintenance schedule.',
      invoiced: true,
    },
    invoiceAmount: 1075,
  },
  {
    id: 8, type: 'ELECTRICAL', customerId: 6, techId: 'PS',
    status: 'Complete', scheduledDate: fmt(addDays(today, -2)),
    address: '3400 Boundary Rd, Burnaby BC',
    description: 'Emergency â gymnasium breaker tripping',
    arrivedAt: '2026-05-01 14:00', completedAt: '2026-05-01 16:30',
    workflow: {
      step: 5, arrived: '2026-05-01 14:00',
      diagnoseNotes: 'Overloaded 20A circuit from new AV equipment. Ran dedicated 30A circuit to AV rack.',
      diagnoseCategory: 'Repair',
      lineItems: [
        { id: 1, description: '30A Double-Pole Breaker', qty: 1,  unitPrice: 65  },
        { id: 2, description: '10 AWG Wire (30 ft)',     qty: 30, unitPrice: 1.80 },
        { id: 3, description: 'Emergency Call Fee',      qty: 1,  unitPrice: 150 },
        { id: 4, description: 'Labour',                  qty: 2.5,unitPrice: 110 },
      ],
      completionNote: 'Circuit isolated and tested under full AV load. No further issues.',
      invoiced: false,
    },
    invoiceAmount: null,
  },
]

// âââ HELPERS âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function lineTotal(items) {
  return items.reduce((s, i) => s + i.qty * i.unitPrice, 0)
}

function Avatar({ techId, size = 'sm' }) {
  const tech = TECHS.find(t => t.id === techId)
  if (!tech) return null
  const sz = size === 'lg' ? 'w-10 h-10 text-sm' : 'w-7 h-7 text-xs'
  return (
    <span
      className={`${sz} rounded-full inline-flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ backgroundColor: tech.color }}
      title={tech.name}
    >
      {tech.id}
    </span>
  )
}

// âââ ROOT COMPONENT ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

export default function TradeDesk() {
  const [activeTab,      setActiveTab]      = useState('dispatch')
  const [jobs,           setJobs]           = useState(JOBS_SEED)
  const [customers,      setCustomers]      = useState(CUSTOMERS_SEED)

  // Dispatch filters
  const [filterTech,   setFilterTech]   = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Job Workflow
  const [activeJobId,  setActiveJobId]  = useState(3)
  const [newLineItem,  setNewLineItem]  = useState({ description: '', qty: 1, unitPrice: 0 })

  // Customers
  const [expandedCust,    setExpandedCust]    = useState(null)
  const [showAddCustomer, setShowAddCustomer] = useState(false)
  const [newCust, setNewCust] = useState({
    name: '', type: 'Residential', address: '', phone: '', email: '',
    equipment: [{ type: 'HVAC', brand: '', model: '', year: new Date().getFullYear() }],
  })

  const activeJob = useMemo(() => jobs.find(j => j.id === activeJobId), [jobs, activeJobId])

  const filteredJobs = useMemo(() =>
    jobs.filter(j => {
      if (filterTech   !== 'all' && j.techId !== filterTech)     return false
      if (filterStatus !== 'all' && j.status !== filterStatus)   return false
      return true
    }),
  [jobs, filterTech, filterStatus])

  // ââ Mutators ââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  function updateJob(id, patch) {
    setJobs(prev => prev.map(j => j.id === id ? { ...j, ...patch } : j))
  }
  function updateWorkflow(id, wfPatch) {
    setJobs(prev => prev.map(j =>
      j.id === id ? { ...j, workflow: { ...j.workflow, ...wfPatch } } : j
    ))
  }

  function advanceStep(job) {
    const now  = new Date().toLocaleString('en-CA', { hour12: false }).replace(',', '')
    const next = job.workflow.step + 1
    const wf   = { step: next }
    if (next === 2) { wf.arrived = now; updateJob(job.id, { status: 'En Route',    arrivedAt: now }) }
    if (next === 3) {                    updateJob(job.id, { status: 'In Progress'               }) }
    if (next === 5) {                    updateJob(job.id, { status: 'Complete',  completedAt: now }) }
    updateWorkflow(job.id, wf)
  }

  function markInvoiced(job) {
    const amt = lineTotal(job.workflow.lineItems)
    updateJob(job.id, { status: 'Invoiced', invoiceAmount: amt })
    updateWorkflow(job.id, { invoiced: true })
  }

  function addLineItem(jobId) {
    if (!newLineItem.description) return
    const item = { ...newLineItem, id: Date.now() }
    setJobs(prev => prev.map(j =>
      j.id === jobId
        ? { ...j, workflow: { ...j.workflow, lineItems: [...j.workflow.lineItems, item] } }
        : j
    ))
    setNewLineItem({ description: '', qty: 1, unitPrice: 0 })
  }

  function removeLineItem(jobId, itemId) {
    setJobs(prev => prev.map(j =>
      j.id === jobId
        ? { ...j, workflow: { ...j.workflow, lineItems: j.workflow.lineItems.filter(i => i.id !== itemId) } }
        : j
    ))
  }

  function addCustomer() {
    const c = {
      ...newCust,
      id: Date.now(),
      lastService: fmt(today),
      nextDue: fmt(addDays(today, 180)),
      equipment: newCust.equipment.map((e, i) => ({ ...e, id: Date.now() + i, serial: 'NEW' })),
    }
    setCustomers(prev => [...prev, c])
    setShowAddCustomer(false)
    setNewCust({ name: '', type: 'Residential', address: '', phone: '', email: '',
      equipment: [{ type: 'HVAC', brand: '', model: '', year: new Date().getFullYear() }] })
  }

  // ââ Dashboard maths âââââââââââââââââââââââââââââââââââââââââââââââââââââ

  const todayStr    = fmt(today)
  const weekAgoStr  = fmt(addDays(today, -7))
  const twoWksStr   = fmt(addDays(today, -14))

  const todayJobs      = jobs.filter(j => j.scheduledDate === todayStr)
  const todayDone      = todayJobs.filter(j => j.status === 'Complete' || j.status === 'Invoiced').length
  const todayActive    = todayJobs.filter(j => j.status === 'In Progress' || j.status === 'En Route').length
  const thisWeekJobs   = jobs.filter(j => j.scheduledDate >= weekAgoStr && j.scheduledDate <= todayStr)
  const lastWeekJobs   = jobs.filter(j => j.scheduledDate >= twoWksStr  && j.scheduledDate <  weekAgoStr)
  const thisWeekRev    = thisWeekJobs.filter(j => j.invoiceAmount).reduce((s,j) => s + j.invoiceAmount, 0)
  const lastWeekRev    = lastWeekJobs.filter(j => j.invoiceAmount).reduce((s,j) => s + j.invoiceAmount, 0)
  const outstanding    = jobs.filter(j => j.status === 'Complete' && !j.workflow.invoiced)
                             .reduce((s,j) => s + lineTotal(j.workflow.lineItems), 0)
  const techRanking    = TECHS.map(t => ({
    ...t,
    done: jobs.filter(j => j.techId === t.id && (j.status === 'Complete' || j.status === 'Invoiced')).length,
  })).sort((a,b) => b.done - a.done)

  const doneWithTime   = jobs.filter(j => j.arrivedAt && j.completedAt)
  const avgMins        = doneWithTime.length
    ? Math.round(doneWithTime.reduce((s,j) => {
        const a = new Date(j.arrivedAt.replace(' ','T'))
        const c = new Date(j.completedAt.replace(' ','T'))
        return s + (c - a) / 60000
      }, 0) / doneWithTime.length)
    : 0

  const barDays = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, i - 6)
    return { label: d.toLocaleDateString('en-CA', { weekday: 'short' }), date: fmt(d) }
  }).map(d => ({
    ...d,
    rev: jobs.filter(j => j.scheduledDate === d.date && j.invoiceAmount).reduce((s,j) => s + j.invoiceAmount, 0),
  }))
  const maxBar = Math.max(...barDays.map(d => d.rev), 1)

  // ââ Render âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

  const tabs = [
    { id: 'dispatch',  label: 'ð Dispatch'  },
    { id: 'workflow',  label: 'ð§ Workflow'  },
    { id: 'customers', label: 'ð¥ Customers' },
    { id: 'dashboard', label: 'ð Dashboard' },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ââ Header ââ */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-30">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">TD</span>
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-900 leading-none">TradeDesk</h1>
            <p className="text-[10px] text-gray-400 leading-none mt-0.5">Field Service Manager</p>
          </div>
        </div>
        <span className="text-xs text-gray-400 hidden sm:block">
          {today.toLocaleDateString('en-CA', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </span>
      </header>

      {/* ââ Tabs ââ */}
      <nav className="bg-white border-b border-gray-200 px-2 sticky top-[57px] z-20">
        <div className="flex">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === t.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      {/* ââ Main content ââ */}
      <main className="max-w-5xl mx-auto px-4 py-6">

        {activeTab === 'dispatch' && (
          <DispatchBoard
            jobs={filteredJobs} allJobs={jobs} customers={customers}
            filterTech={filterTech} filterStatus={filterStatus}
            setFilterTech={setFilterTech} setFilterStatus={setFilterStatus}
            updateJob={updateJob}
            onOpenJob={id => { setActiveJobId(id); setActiveTab('workflow') }}
          />
        )}

        {activeTab === 'workflow' && (
          <JobWorkflow
            jobs={jobs} customers={customers}
            activeJobId={activeJobId} setActiveJobId={setActiveJobId}
            activeJob={activeJob}
            advanceStep={advanceStep} updateWorkflow={updateWorkflow}
            markInvoiced={markInvoiced}
            addLineItem={addLineItem} removeLineItem={removeLineItem}
            newLineItem={newLineItem} setNewLineItem={setNewLineItem}
          />
        )}

        {activeTab === 'customers' && (
          <CustomersTab
            customers={customers} jobs={jobs}
            expandedCust={expandedCust} setExpandedCust={setExpandedCust}
            showAddCustomer={showAddCustomer} setShowAddCustomer={setShowAddCustomer}
            newCust={newCust} setNewCust={setNewCust}
            addCustomer={addCustomer}
          />
        )}

        {activeTab === 'dashboard' && (
          <Dashboard
            todayJobs={todayJobs} todayDone={todayDone} todayActive={todayActive}
            thisWeekRev={thisWeekRev} lastWeekRev={lastWeekRev}
            outstanding={outstanding} techRanking={techRanking}
            avgMins={avgMins} barDays={barDays} maxBar={maxBar}
            jobs={jobs}
          />
        )}

      </main>
    </div>
  )
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// TAB 1 â DISPATCH BOARD
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function DispatchBoard({ jobs, allJobs, customers, filterTech, filterStatus,
                         setFilterTech, setFilterStatus, updateJob, onOpenJob }) {
  return (
    <div>
      {/* Toolbar */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Dispatch Board</h2>
          <p className="text-sm text-gray-500 mt-0.5">{jobs.length} job{jobs.length !== 1 ? 's' : ''} shown</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <select value={filterTech} onChange={e => setFilterTech(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Techs</option>
            {TECHS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
            className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="all">All Statuses</option>
            {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Status lane summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 mb-5">
        {STATUSES.map(s => {
          const n = allJobs.filter(j => j.status === s).length
          return (
            <button
              key={s}
              onClick={() => setFilterStatus(filterStatus === s ? 'all' : s)}
              className={`text-center py-2 px-1 rounded-lg text-xs font-semibold border transition-all ${
                filterStatus === s ? 'ring-2 ring-offset-1 ring-blue-400 ' : ''
              }${STATUS_COLORS[s]}`}
            >
              {s} <span className="opacity-70">({n})</span>
            </button>
          )
        })}
      </div>

      {/* Cards */}
      <div className="grid gap-3">
        {jobs.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">ð</div>
            <p className="text-sm">No jobs match your filters</p>
          </div>
        )}
        {jobs.map(job => {
          const customer = customers.find(c => c.id === job.customerId)
          const jt       = JOB_TYPES[job.type]
          const est      = lineTotal(job.workflow.lineItems)
          return (
            <div key={job.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 flex-1 min-w-0">
                    <span className="text-2xl mt-0.5 flex-shrink-0">{jt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${jt.color}`}>{jt.label}</span>
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[job.status]}`}>{job.status}</span>
                      </div>
                      <p className="font-semibold text-gray-900 mt-1 text-sm leading-snug">{job.description}</p>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">ð¤ {customer?.name}</p>
                      <p className="text-xs text-gray-400 truncate">ð {job.address}</p>
                      <p className="text-xs text-gray-400">ð {job.scheduledDate}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <Avatar techId={job.techId} />
                    {est > 0 && (
                      <span className="text-xs font-semibold text-green-700 bg-green-50 px-2 py-0.5 rounded-full">
                        est ${est.toFixed(0)}
                      </span>
                    )}
                    {job.invoiceAmount && (
                      <span className="text-xs font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-full">
                        inv ${job.invoiceAmount}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50 gap-3">
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <span className="text-xs text-gray-500 whitespace-nowrap">Assign:</span>
                    <select
                      value={job.techId}
                      onChange={e => updateJob(job.id, { techId: e.target.value })}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1 bg-white flex-1 min-w-0 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    >
                      {TECHS.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                    </select>
                  </div>
                  <button
                    onClick={() => onOpenJob(job.id)}
                    className="text-xs bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg font-semibold transition-colors whitespace-nowrap"
                  >
                    Open Job â
                  </button>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// TAB 2 â JOB WORKFLOW
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

const WF_STEPS = [
  { num: 1, label: 'Arrive',   icon: 'ð' },
  { num: 2, label: 'Diagnose', icon: 'ð' },
  { num: 3, label: 'Quote',    icon: 'ð°' },
  { num: 4, label: 'Complete', icon: 'â' },
  { num: 5, label: 'Invoice',  icon: 'ð' },
]
const ISSUE_CATS = ['Maintenance', 'Repair', 'Installation', 'Replacement', 'Inspection', 'Emergency']

function JobWorkflow({ jobs, customers, activeJobId, setActiveJobId, activeJob,
                       advanceStep, updateWorkflow, markInvoiced,
                       addLineItem, removeLineItem, newLineItem, setNewLineItem }) {
  const customer = customers.find(c => c.id === activeJob?.customerId)
  const jt       = activeJob ? JOB_TYPES[activeJob.type] : null
  const est      = activeJob ? lineTotal(activeJob.workflow.lineItems) : 0
  const step     = activeJob?.workflow.step ?? 1

  return (
    <div className="max-w-xl mx-auto">

      {/* Job selector */}
      <div className="mb-5">
        <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1.5">Select Job</label>
        <select
          value={activeJobId}
          onChange={e => setActiveJobId(Number(e.target.value))}
          className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {jobs.map(j => {
            const c = customers.find(c => c.id === j.customerId)
            return <option key={j.id} value={j.id}>#{j.id} Â· {c?.name} â {j.description.substring(0, 42)}</option>
          })}
        </select>
      </div>

      {activeJob && (<>

        {/* Job card */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="flex items-start gap-3">
            <span className="text-3xl">{jt?.icon}</span>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-1.5 mb-1">
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${jt?.color}`}>{jt?.label}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${STATUS_COLORS[activeJob.status]}`}>{activeJob.status}</span>
              </div>
              <p className="font-bold text-gray-900">{activeJob.description}</p>
              <p className="text-sm text-gray-500">{customer?.name}</p>
              <p className="text-xs text-gray-400">{activeJob.address}</p>
            </div>
            <Avatar techId={activeJob.techId} size="lg" />
          </div>
        </div>

        {/* Step progress */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-4">
          <div className="flex justify-between mb-3">
            {WF_STEPS.map(s => (
              <div key={s.num} className="flex flex-col items-center gap-1 flex-1">
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-lg transition-all ${
                  step > s.num ? 'bg-green-500 text-white'
                  : step === s.num ? 'bg-blue-600 text-white ring-2 ring-blue-300 shadow-md'
                  : 'bg-gray-100 text-gray-400'
                }`}>
                  {step > s.num ? 'â' : s.icon}
                </div>
                <span className={`text-[10px] font-semibold ${step >= s.num ? 'text-gray-700' : 'text-gray-400'}`}>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="bg-blue-600 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, ((step - 1) / 4) * 100)}%` }}
            />
          </div>
        </div>

        {/* ââ Step 1: Arrive ââ */}
        {step === 1 && (
          <WFCard icon="ð" title="Step 1 â Arrive on Site">
            <p className="text-sm text-gray-500 mb-4">Tap <strong>Mark Arrived</strong> when you pull up. This records your arrival timestamp.</p>
            <button
              onClick={() => advanceStep(activeJob)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold text-base transition-colors"
            >
              ð Mark Arrived
            </button>
          </WFCard>
        )}

        {/* ââ Step 2: Diagnose ââ */}
        {step === 2 && (
          <WFCard icon="ð" title="Step 2 â Diagnose">
            {activeJob.arrivedAt && <p className="text-xs text-green-600 mb-3">â Arrived {activeJob.arrivedAt}</p>}
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Issue Category *</label>
                <select
                  value={activeJob.workflow.diagnoseCategory}
                  onChange={e => updateWorkflow(activeJob.id, { diagnoseCategory: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Selectâ¦</option>
                  {ISSUE_CATS.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Diagnostic Notes *</label>
                <textarea
                  value={activeJob.workflow.diagnoseNotes}
                  onChange={e => updateWorkflow(activeJob.id, { diagnoseNotes: e.target.value })}
                  placeholder="What did you find? Be specific."
                  rows={4}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                disabled={!activeJob.workflow.diagnoseCategory || !activeJob.workflow.diagnoseNotes.trim()}
                onClick={() => advanceStep(activeJob)}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-bold transition-colors"
              >
                Next: Build Quote â
              </button>
            </div>
          </WFCard>
        )}

        {/* ââ Step 3: Quote ââ */}
        {step === 3 && (
          <WFCard icon="ð°" title="Step 3 â Quote">
            {/* Existing line items */}
            <div className="space-y-1.5 mb-4">
              {activeJob.workflow.lineItems.length === 0
                ? <p className="text-sm text-gray-400 italic text-center py-3">No line items yet</p>
                : activeJob.workflow.lineItems.map(item => (
                    <div key={item.id} className="flex items-center gap-2 bg-gray-50 rounded-lg p-2 text-sm">
                      <span className="flex-1 truncate">{item.description}</span>
                      <span className="text-gray-400 text-xs whitespace-nowrap">{item.qty}Ã${item.unitPrice.toFixed(2)}</span>
                      <span className="font-semibold w-16 text-right">${(item.qty * item.unitPrice).toFixed(2)}</span>
                      <button onClick={() => removeLineItem(activeJob.id, item.id)} className="text-red-400 hover:text-red-600 ml-1 flex-shrink-0">â</button>
                    </div>
                  ))
              }
            </div>

            {/* Add line item form */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 space-y-2">
              <p className="text-xs font-bold text-blue-700">Add Line Item</p>
              <input
                value={newLineItem.description}
                onChange={e => setNewLineItem(p => ({ ...p, description: e.target.value }))}
                placeholder="Part or service description"
                className="w-full border border-blue-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
              <div className="flex gap-2">
                <input type="number" min="0.1" step="0.1"
                  value={newLineItem.qty}
                  onChange={e => setNewLineItem(p => ({ ...p, qty: parseFloat(e.target.value) || 1 }))}
                  placeholder="Qty"
                  className="w-20 border border-blue-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <input type="number" min="0" step="0.01"
                  value={newLineItem.unitPrice}
                  onChange={e => setNewLineItem(p => ({ ...p, unitPrice: parseFloat(e.target.value) || 0 }))}
                  placeholder="Unit price"
                  className="flex-1 border border-blue-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                />
                <button
                  onClick={() => addLineItem(activeJob.id)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded-lg font-bold transition-colors"
                >+</button>
              </div>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between bg-gray-900 text-white rounded-xl px-4 py-3 mb-4">
              <span className="font-semibold">Estimated Total</span>
              <span className="text-2xl font-bold">${est.toFixed(2)}</span>
            </div>

            <button
              disabled={activeJob.workflow.lineItems.length === 0}
              onClick={() => advanceStep(activeJob)}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-bold transition-colors"
            >
              Next: Complete Work â
            </button>
          </WFCard>
        )}

        {/* ââ Step 4: Complete ââ */}
        {step === 4 && (
          <WFCard icon="â" title="Step 4 â Complete Work">
            <div className="space-y-3">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Completion Notes *</label>
                <textarea
                  value={activeJob.workflow.completionNote}
                  onChange={e => updateWorkflow(activeJob.id, { completionNote: e.target.value })}
                  placeholder="Summarise work completed and any recommendationsâ¦"
                  rows={5}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                disabled={!activeJob.workflow.completionNote.trim()}
                onClick={() => advanceStep(activeJob)}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-bold transition-colors"
              >
                â Mark Job Complete
              </button>
            </div>
          </WFCard>
        )}

        {/* ââ Step 5: Invoice ââ */}
        {step >= 5 && (
          <WFCard icon="ð" title="Step 5 â Invoice">
            <div className="mb-4">
              <div className="flex justify-between text-xs text-gray-400 mb-2">
                <span>Description</span><span>Subtotal</span>
              </div>
              {activeJob.workflow.lineItems.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-1 border-b border-gray-50">
                  <span className="text-gray-700">{item.description} ({item.qty}Ã)</span>
                  <span className="font-medium">${(item.qty * item.unitPrice).toFixed(2)}</span>
                </div>
              ))}
              <div className="flex justify-between mt-3 pt-2 border-t-2 border-gray-200">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">${est.toFixed(2)}</span>
              </div>
            </div>

            <div className="text-xs text-gray-400 space-y-0.5 mb-4">
              <p>â Arrived:   {activeJob.arrivedAt}</p>
              <p>â Completed: {activeJob.completedAt}</p>
              <p>â Tech:      {TECHS.find(t => t.id === activeJob.techId)?.name}</p>
              <p>â Category:  {activeJob.workflow.diagnoseCategory}</p>
            </div>

            {activeJob.workflow.invoiced ? (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 text-center">
                <p className="text-purple-700 font-bold text-lg">â Invoiced</p>
                <p className="text-purple-500 text-sm">${activeJob.invoiceAmount?.toFixed(2)}</p>
              </div>
            ) : (
              <button
                onClick={() => markInvoiced(activeJob)}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-bold transition-colors"
              >
                ð Send Invoice â ${est.toFixed(2)}
              </button>
             )}
          </WFCard>
        )}

      </>)}
    </div>
  )
}

function WFCard({ icon, title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-xl">{icon}</span>
        <h3 className="font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  )
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// TAB 3 â CUSTOMERS & EQUIPMENT
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function CustomersTab({ customers, jobs, expandedCust, setExpandedCust,
                        showAddCustomer, setShowAddCustomer, newCust, setNewCust, addCustomer }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Customers & Equipment</h2>
          <p className="text-sm text-gray-500">{customers.length} customers on record</p>
        </div>
        <button
          onClick={() => setShowAddCustomer(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
        >
          + Add Customer
        </button>
      </div>

      <div className="grid gap-3">
        {customers.map(c => {
          const open     = expandedCust === c.id
          const custJobs = jobs.filter(j => j.customerId === c.id).sort((a,b) => b.scheduledDate.localeCompare(a.scheduledDate))
          const initials = c.name.split(' ').map(w => w[0]).join('').substring(0, 2)
          return (
            <div key={c.id} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <button onClick={() => setExpandedCust(open ? null : c.id)}
                className="w-full text-left p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0 ${c.type === 'Commercial' ? 'bg-orange-500' : 'bg-blue-500'}`}>
                      {initials}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-gray-900">{c.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${c.type === 'Commercial' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'}`}>
                          {c.type}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{c.address}</p>
                      <p className="text-xs text-gray-400">{c.phone}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-gray-400">Last service</p>
                      <p className="text-xs font-semibold text-gray-700">{c.lastService}</p>
                      <p className="text-xs text-gray-400">Next: {c.nextDue}</p>
                    </div>
                    <span className="text-gray-300 text-sm">{open ? 'â¯' : 'â¼'}</span>
                  </div>
                </div>
              </button>

              {open && (
                <div className="px-4 pb-4 border-t border-gray-50 pt-3">
                  <div className="grid sm:grid-cols-2 gap-4">

                    {/* Equipment */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Equipment</h4>
                      <div className="space-y-2">
                        {c.equipment.map(eq => (
                          <div key={eq.id} className="bg-gray-50 rounded-lg p-3 text-sm">
                            <div className="flex items-center gap-2">
                              <span>{eq.type === 'HVAC' ? 'âï¸' : eq.type === 'Plumbing' ? 'ð©' : 'â¡'}</span>
                              <span className="font-semibold text-gray-800">{eq.brand} {eq.model}</span>
                              <span className="text-gray-400 text-xs">{eq.year}</span>
                            </div>
                            <p className="text-xs text-gray-400 mt-0.5">S/N: {eq.serial}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Job History */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">
                        Job History ({custJobs.length})
                      </h4>
                      {custJobs.length === 0
                        ? <p className="text-xs text-gray-400 italic">No jobs on record</p>
                        : (
                          <div className="space-y-2">
                            {custJobs.map(j => (
                              <div key={j.id} className="bg-gray-50 rounded-lg p-2.5 text-xs">
                                <div className="flex items-start justify-between gap-1">
                                  <span className="font-medium text-gray-700 leading-snug">{JOB_TYPES[j.type]?.icon} {j.description.substring(0, 38)}</span>
                                  <span className={`px-1.5 py-0.5 rounded-full border flex-shrink-0 ${STATUS_COLORS[j.status]}`}>{j.status}</span>
                                </div>
                                <div className="text-gray-400 mt-0.5">
                                  {j.scheduledDate} Â· {TECHS.find(t => t.id === j.techId)?.name}
                                </div>
                                {j.invoiceAmount && <div className="text-green-700 font-bold mt-0.5">${j.invoiceAmount.toFixed(2)}</div>}
                              </div>
                            ))}
                          </div>
                        )
                      }
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ââ Add Customer Modal ââ */}
      {showAddCustomer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-lg font-bold text-gray-900">Add New Customer</h3>
                <button onClick={() => setShowAddCustomer(false)} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">Ã</button>
              </div>
              <div className="space-y-3">
                <Field label="Customer Name *">
                  <input value={newCust.name} onChange={e => setNewCust(p => ({ ...p, name: e.target.value }))}
                    placeholder="e.g. Smith Residence or ABC Corp" className={inputCls} />
                </Field>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Type">
                    <select value={newCust.type} onChange={e => setNewCust(p => ({ ...p, type: e.target.value }))} className={inputCls}>
                      <option>Residential</option><option>Commercial</option>
                    </select>
                  </Field>
                  <Field label="Phone">
                    <input value={newCust.phone} onChange={e => setNewCust(p => ({ ...p, phone: e.target.value }))}
                      placeholder="604-555-0000" className={inputCls} />
                  </Field>
                </div>
                <Field label="Address">
                  <input value={newCust.address} onChange={e => setNewCust(p => ({ ...p, address: e.target.value }))}
                    placeholder="123 Main St, City BC" className={inputCls} />
                </Field>
                <Field label="Email">
                  <input value={newCust.email} onChange={e => setNewCust(p => ({ ...p, email: e.target.value }))}
                    placeholder="customer@email.com" className={inputCls} />
                </Field>

                <div className="pt-2 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Primary Equipment</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Field label="Type">
                      <select value={newCust.equipment[0]?.type}
                        onChange={e => setNewCust(p => ({ ...p, equipment: [{ ...p.equipment[0], type: e.target.value }] }))}
                        className={inputCls}>
                        <option>HVAC</option><option>Plumbing</option><option>Electrical</option>
                      </select>
                    </Field>
                    <Field label="Year">
                      <input type="number" value={newCust.equipment[0]?.year}
                        onChange={e => setNewCust(p => ({ ...p, equipment: [{ ...p.equipment[0], year: +e.target.value }] }))}
                        className={inputCls} />
                    </Field>
                    <Field label="Brand">
                      <input value={newCust.equipment[0]?.brand}
                        onChange={e => setNewCust(p => ({ ...p, equipment: [{ ...p.equipment[0], brand: e.target.value }] }))}
                        placeholder="e.g. Lennox" className={inputCls} />
                    </Field>
                    <Field label="Model">
                      <input value={newCust.equipment[0]?.model}
                        onChange={e => setNewCust(p => ({ ...p, equipment: [{ ...p.equipment[0], model: e.target.value }] }))}
                        placeholder="e.g. XC21" className={inputCls} />
                    </Field>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button onClick={() => setShowAddCustomer(false)}
                    className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button
                    disabled={!newCust.name.trim()}
                    onClick={addCustomer}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white py-2.5 rounded-xl font-bold transition-colors">
                    Add Customer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const inputCls = 'w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs font-semibold text-gray-500 block mb-1">{label}</label>
      {children}
    </div>
  )
}

// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ
// TAB 4 â DASHBOARD
// âââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââââ

function Dashboard({ todayJobs, todayDone, todayActive,
                     thisWeekRev, lastWeekRev,
                     outstanding, techRanking, avgMins,
                     barDays, maxBar, jobs }) {

  const revDelta = lastWeekRev > 0
    ? Math.round(((thisWeekRev - lastWeekRev) / lastWeekRev) * 100)
    : null

  return (
    <div>
      <div className="mb-5">
        <h2 className="text-xl font-bold text-gray-900">Owner Dashboard</h2>
        <p className="text-sm text-gray-500">Live business snapshot</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <KPICard label="Today's Jobs"    value={todayJobs.length} sub="total scheduled"   icon="ð" accent="blue"   />
        <KPICard label="Complete Today"  value={todayDone}        sub={`of ${todayJobs.length} jobs`} icon="â" accent="green"  />
        <KPICard label="Active Now"      value={todayActive}      sub="en route / in progress" icon="ð§" accent="yellow" />
        <KPICard label="Outstanding"     value={`$${outstanding.toFixed(0)}`} sub="awaiting invoice" icon="ð¸" accent="orange" />
      </div>

      {/* Revenue bar chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 mb-4">
        <div className="flex items-start justify-between gap-4 mb-5 flex-wrap">
          <div>
            <h3 className="font-bold text-gray-900">Revenue â Last 7 Days</h3>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-3xl font-bold text-gray-900">${thisWeekRev.toLocaleString()}</span>
              {revDelta !== null && (
                <span className={`text-sm font-semibold px-2 py-0.5 rounded-full ${revDelta >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {revDelta >= 0 ? 'â' : 'â'} {Math.abs(revDelta)}% vs prev week
                </span>
              )}
            </div>
          </div>
        </div>

        {/* SVG bar chart */}
        <div className="flex items-end gap-2 h-36 pt-4">
          {barDays.map(d => {
            const pct    = maxBar > 0 ? (d.rev / maxBar) : 0
            const isToday = d.date === fmt(today)
            return (
              <div key={d.date} className="flex-1 flex flex-col items-center gap-1">
                {d.rev > 0
                  ? <span className="text-[10px] text-gray-500 font-semibold leading-none">${d.rev}</span>
                  : <span className="text-[10px]">&nbsp;</span>
                }
                <div className="w-full flex items-end" style={{ height: '90px' }}>
                  <div
                    className={`w-full rounded-t-md transition-all duration-500 ${
                      isToday ? 'bg-blue-600' : d.rev > 0 ? 'bg-blue-300' : 'bg-gray-100'
                    }`}
                    style={{ height: `${d.rev > 0 ? Math.max(pct * 100, 8) : 4}%` }}
                  />
                </div>
                <span className={`text-[10px] font-semibold leading-none ${isToday ? 'text-blue-600' : 'text-gray-400'}`}>
                  {d.label}{isToday ? ' â' : ''}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">

        {/* Top techs */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4">Top Techs â Jobs Completed</h3>
          <div className="space-y-4">
            {techRanking.map((t, i) => (
              <div key={t.id} className="flex items-center gap-3">
                <span className={`text-sm font-bold w-5 text-center ${i === 0 ? 'text-yellow-500' : 'text-gray-300'}`}>
                  {i === 0 ? 'ð¥' : i === 1 ? 'ð¥' : i === 2 ? 'ð¥' : `${i+1}`}
                </span>
                <Avatar techId={t.id} />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-800">{t.name}</span>
                    <span className="text-sm font-bold text-gray-700">{t.done} jobs</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-500"
                      style={{
                        width: `${techRanking[0].done > 0 ? (t.done / techRanking[0].done) * 100 : 0}%`,
                        backgroundColor: t.color,
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">

          {/* Avg completion */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-3">Avg Job Completion Time</h3>
            <div className="flex items-end gap-3">
              <span className="text-4xl font-bold text-blue-600">
                {Math.floor(avgMins / 60)}h {avgMins % 60}m
              </span>
              <span className="text-sm text-gray-400 mb-1">
                across {jobs.filter(j => j.arrivedAt && j.completedAt).length} jobs
              </span>
            </div>
          </div>

          {/* Invoice pipeline */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="font-bold text-gray-900 mb-3">Invoice Pipeline</h3>
            <div className="space-y-2.5">
              {[
                { label: 'Invoiced',          color: 'bg-purple-500', jobs: jobs.filter(j => j.status === 'Invoiced') },
                { label: 'Ready to invoice',  color: 'bg-orange-400', jobs: jobs.filter(j => j.status === 'Complete' && !j.workflow.invoiced) },
                { label: 'In progress',       color: 'bg-yellow-400', jobs: jobs.filter(j => j.status === 'In Progress' || j.status === 'En Route') },
                { label: 'Scheduled',         color: 'bg-slate-300',  jobs: jobs.filter(j => j.status === 'Scheduled') },
              ].map(row => {
                const val = row.jobs.reduce((s,j) => s + (j.invoiceAmount || lineTotal(j.workflow.lineItems)), 0)
                return (
                  <div key={row.label} className="flex items-center gap-3 text-sm">
                    <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${row.color}`} />
                    <span className="flex-1 text-gray-600">{row.label}</span>
                    <span className="font-semibold text-gray-800">{row.jobs.length}</span>
                    <span className="text-gray-400 text-xs w-16 text-right">${val.toFixed(0)}</span>
                  </div>
                )
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

const ACCENT = {
  blue:   'bg-blue-50   border-blue-100',
  green:  'bg-green-50  border-green-100',
  yellow: 'bg-yellow-50 border-yellow-100',
  orange: 'bg-orange-50 border-orange-100',
}
function KPICard({ label, value, sub, icon, accent }) {
  return (
    <div className={`rounded-xl border p-4 ${ACCENT[accent]}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide leading-none">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2 leading-none">{value}</p>
          <p className="text-xs text-gray-400 mt-1">{sub}</p>
        </div>
        <span className="text-xl">{icon}</span>
      </div>
    </div>
  )
}
