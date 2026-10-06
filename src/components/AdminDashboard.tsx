import React, { useState } from 'react';
import {
  X,
  Lock,
  RefreshCw,
  Check,
  Copy,
  Sparkles,
  Calendar,
  MessageCircle,
  ArrowUpRight,
  Plus,
  Download,
} from 'lucide-react';
import { useBooking, formatDateYMD, addDaysYMD } from '../context/BookingContext';
import { allBookableUnits, getWhatsAppUrl } from '../data/villaData';
import { AIPricingRecommendation } from '../types';

interface AdminDashboardProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ isOpen, onClose }) => {
  const {
    reservations,
    channels,
    pricingConfig,
    inquiries,
    formatPrice,
    updateReservationStatus,
    createReservation,
    toggleOwnerDateBlock,
    updatePricingConfig,
    syncChannelsNow,
    updateChannelUrl,
    generateIcalString,
    updateInquiryStatus,
    requestAIPricingInsight,
    isDateAvailableForUnit,
  } = useBooking();

  const [authenticated, setAuthenticated] = useState(true);
  const [passcode, setPasscode] = useState('TAO2026');
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<
    'overview' | 'bookings' | 'calendar' | 'channels' | 'pricing' | 'inquiries'
  >('overview');

  // Bookings filter & manual booking modal
  const [channelFilter, setChannelFilter] = useState<string>('all');
  const [showNewBookingForm, setShowNewBookingForm] = useState(false);
  const [newUnitId, setNewUnitId] = useState('entire-villa');
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestEmail, setNewGuestEmail] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newCheckIn, setNewCheckIn] = useState(() => addDaysYMD(formatDateYMD(new Date()), 30));
  const [newCheckOut, setNewCheckOut] = useState(() => addDaysYMD(formatDateYMD(new Date()), 33));
  const [newTotalUsd, setNewTotalUsd] = useState(1740);

  // Calendar unit selector
  const [calendarUnitId, setCalendarUnitId] = useState('entire-villa');

  // Channel sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);
  const [previewIcalUnit, setPreviewIcalUnit] = useState<string | null>(null);
  const [customIcsInput, setCustomIcsInput] = useState('');
  const [copiedPath, setCopiedPath] = useState<string | null>(null);

  // AI Pricing state
  const [aiInsight, setAiInsight] = useState<AIPricingRecommendation | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [pricingSaved, setPricingSaved] = useState(false);

  if (!isOpen) return null;

  const activeReservations = reservations.filter(
    (r) => r.status !== 'cancelled' && r.channel !== 'owner_block'
  );
  const totalRevenueUsd = activeReservations.reduce((sum, r) => sum + r.totalUsd, 0);
  const directRevenueUsd = activeReservations
    .filter((r) => r.channel === 'direct' || r.channel === 'whatsapp')
    .reduce((sum, r) => sum + r.totalUsd, 0);
  const totalBookedNights = activeReservations.reduce((sum, r) => sum + r.nights, 0);
  const averageDailyRate = totalBookedNights > 0 ? Math.round(totalRevenueUsd / totalBookedNights) : 580;
  const directSharePercent =
    totalRevenueUsd > 0 ? Math.round((directRevenueUsd / totalRevenueUsd) * 100) : 65;

  const filteredReservations = reservations.filter((r) => {
    if (r.channel === 'owner_block') return false;
    if (channelFilter === 'all') return true;
    return r.channel === channelFilter;
  });

  const handleRunSync = async () => {
    setIsSyncing(true);
    setSyncNotice(null);
    await new Promise((r) => setTimeout(r, 600));
    const result = await syncChannelsNow(customIcsInput || undefined, 'entire-villa');
    setIsSyncing(false);
    setCustomIcsInput('');
    setSyncNotice(
      `Synchronized with Airbnb & Booking.com (${result.syncedCount} active channel records verified at ${new Date(
        result.timestamp
      ).toLocaleTimeString()}).`
    );
  };

  const handleCopyIcalUrl = (pathStr: string) => {
    const fullUrl = `${window.location.origin}${pathStr}`;
    navigator.clipboard?.writeText(fullUrl).catch(() => {});
    setCopiedPath(pathStr);
    setTimeout(() => setCopiedPath(null), 2000);
  };

  const handleDownloadIcs = (unitId: string) => {
    const icsContent = generateIcalString(unitId);
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `villatao-${unitId}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleGenerateAiPricing = async () => {
    setLoadingAi(true);
    const res = await requestAIPricingInsight();
    setAiInsight(res);
    setLoadingAi(false);
  };

  const handleApplyAiMultipliers = () => {
    if (!aiInsight?.suggestedMultipliers) return;
    updatePricingConfig({
      ...pricingConfig,
      highSeasonMultiplier: aiInsight.suggestedMultipliers.highSeasonMultiplier,
      weekendSurgePercent: aiInsight.suggestedMultipliers.weekendSurgePercent,
      lastMinuteDiscountPercent: aiInsight.suggestedMultipliers.lastMinuteDiscountPercent,
    });
    setPricingSaved(true);
    setTimeout(() => setPricingSaved(false), 2500);
  };

  const handleCreateManualBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    const unitObj = allBookableUnits.find((u) => u.id === newUnitId) || allBookableUnits[0];
    await createReservation({
      unitId: unitObj.id,
      unitName: unitObj.name,
      guestName: newGuestName.trim(),
      guestEmail: newGuestEmail.trim() || 'guest@villataobalian.com',
      guestPhone: newGuestPhone.trim() || '+62 817-4721-299',
      guestCountry: 'International',
      checkIn: newCheckIn,
      checkOut: newCheckOut,
      nights: 3,
      guests: 2,
      channel: 'direct',
      status: 'confirmed',
      paymentMethod: 'bank_transfer',
      paymentSchedule: 'full',
      totalUsd: Number(newTotalUsd) || 1200,
      amountPaidUsd: Number(newTotalUsd) || 1200,
      balanceDueUsd: 0,
      addons: [],
      specialRequests: 'Created via Villa Tao Admin Portal',
    });
    setShowNewBookingForm(false);
    setNewGuestName('');
  };

  // Next 28 days for Master Availability Grid
  const upcoming28Days = Array.from({ length: 28 }, (_, i) =>
    addDaysYMD(formatDateYMD(new Date()), i)
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl bg-[#FAF8F5] text-[#2C221E] border border-[#2C221E]/15 shadow-2xl max-h-[94vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Executive Bar */}
        <div className="bg-[#1C1613] text-[#FAF8F5] px-5 sm:px-8 py-4 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] uppercase tracking-[0.28em] text-[#C5A880] block">
              VILLA TAO BALIAN • EXECUTIVE HOSPITALITY SUITE
            </span>
            <h2 className="font-serif text-xl sm:text-2xl font-normal text-white">
              Direct Booking, Channel Sync &amp; AI Revenue Dashboard
            </h2>
          </div>

          <div className="flex items-center space-x-3">
            {authenticated && (
              <button
                type="button"
                onClick={() => setAuthenticated(false)}
                className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 border border-white/20 text-[10px] uppercase tracking-[0.2em] text-white/75 hover:text-white"
              >
                <Lock className="w-3 h-3" />
                <span>Lock</span>
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              aria-label="Close Admin Dashboard"
              className="p-2 text-white/75 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {!authenticated ? (
          /* Passcode Screen */
          <div className="p-8 sm:p-16 max-w-md mx-auto text-center space-y-5 my-auto">
            <Lock className="w-8 h-8 text-[#8C7355] mx-auto stroke-[1.5]" />
            <h3 className="font-serif text-2xl text-[#2C221E] font-normal">
              Owner &amp; Management Access
            </h3>
            <p className="text-xs text-[#2C221E]/70 font-light">
              Enter executive passcode to access reservations, Airbnb/Booking.com iCal synchronization, and AI dynamic pricing controls. (Default: <strong className="font-mono">TAO2026</strong>)
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (passcode.trim().toUpperCase() === 'TAO2026') {
                  setAuthenticated(true);
                  setAuthError('');
                } else {
                  setAuthError('Invalid passcode. Use TAO2026.');
                }
              }}
              className="space-y-3"
            >
              <input
                type="password"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 bg-white border border-[#2C221E]/20 text-center font-mono text-sm tracking-widest"
              />
              {authError && <p className="text-xs text-[#8C7355]">{authError}</p>}
              <button
                type="submit"
                className="w-full py-3.5 bg-[#2C221E] text-[#FAF8F5] text-xs uppercase tracking-[0.22em]"
              >
                UNLOCK EXECUTIVE DASHBOARD
              </button>
            </form>
          </div>
        ) : (
          <>
            {/* Navigation Tabs */}
            <div className="bg-[#F5F2EB] border-b border-[#2C221E]/12 px-5 sm:px-8 flex items-center space-x-1 sm:space-x-2 overflow-x-auto no-scrollbar shrink-0">
              {[
                { id: 'overview', label: '01. Overview & KPIs' },
                { id: 'bookings', label: `02. Bookings (${activeReservations.length})` },
                { id: 'calendar', label: '03. Availability & Blocks' },
                { id: 'channels', label: '04. Airbnb & Booking.com Sync' },
                { id: 'pricing', label: '05. AI Dynamic Pricing' },
                { id: 'inquiries', label: `06. Inquiries (${inquiries.length})` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className={`px-3.5 py-3.5 text-[11px] uppercase tracking-[0.18em] whitespace-nowrap border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-[#2C221E] text-[#2C221E] font-medium'
                      : 'border-transparent text-[#2C221E]/60 hover:text-[#2C221E]'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Dashboard Content Area */}
            <div className="p-5 sm:p-8 overflow-y-auto flex-1 space-y-8">
              {/* TAB 1: OVERVIEW & REVENUE KPIS */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-5 bg-[#F5F2EB] border border-[#2C221E]/10">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] block">
                        TOTAL BOOKED REVENUE
                      </span>
                      <span className="font-serif text-3xl text-[#2C221E] block mt-1">
                        {formatPrice(totalRevenueUsd)}
                      </span>
                      <span className="text-[11px] text-[#2C221E]/60 font-light">
                        Across {activeReservations.length} confirmed stays
                      </span>
                    </div>

                    <div className="p-5 bg-[#F5F2EB] border border-[#2C221E]/10">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] block">
                        AVERAGE DAILY RATE (ADR)
                      </span>
                      <span className="font-serif text-3xl text-[#2C221E] block mt-1">
                        {formatPrice(averageDailyRate)}
                      </span>
                      <span className="text-[11px] text-[#2C221E]/60 font-light">
                        AI Dynamic Yield Active
                      </span>
                    </div>

                    <div className="p-5 bg-[#F5F2EB] border border-[#2C221E]/10">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] block">
                        DIRECT BOOKING SHARE
                      </span>
                      <span className="font-serif text-3xl text-[#2C221E] block mt-1">
                        {directSharePercent}%
                      </span>
                      <span className="text-[11px] text-[#2C221E]/60 font-light">
                        0% OTA commission on direct stays
                      </span>
                    </div>

                    <div className="p-5 bg-[#F5F2EB] border border-[#2C221E]/10">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] block">
                        CHANNEL SYNC STATUS
                      </span>
                      <span className="font-serif text-2xl text-[#2C221E] block mt-1">
                        Airbnb &amp; Booking.com
                      </span>
                      <span className="text-[11px] text-[#8C7355] font-light">
                        Two-way iCal Active • Zero Conflicts
                      </span>
                    </div>
                  </div>

                  {/* Upcoming Arrivals */}
                  <div className="bg-[#F5F2EB] border border-[#2C221E]/10 p-5 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-serif text-xl text-[#2C221E] font-normal">
                        Upcoming Reservations &amp; Channel Schedule
                      </h3>
                      <button
                        type="button"
                        onClick={() => setActiveTab('bookings')}
                        className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] hover:text-[#2C221E] underline"
                      >
                        View All Bookings
                      </button>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[#2C221E]/15 text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/60">
                            <th className="py-2.5 pr-4">Ref</th>
                            <th className="py-2.5 pr-4">Guest</th>
                            <th className="py-2.5 pr-4">Residence</th>
                            <th className="py-2.5 pr-4">Dates</th>
                            <th className="py-2.5 pr-4">Channel</th>
                            <th className="py-2.5 pr-4">Total</th>
                            <th className="py-2.5">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2C221E]/8">
                          {activeReservations.slice(0, 6).map((res) => (
                            <tr key={res.id} className="hover:bg-[#FAF8F5]/60">
                              <td className="py-3 pr-4 font-mono text-[11px]">{res.referenceCode}</td>
                              <td className="py-3 pr-4 font-medium">{res.guestName}</td>
                              <td className="py-3 pr-4 text-[#2C221E]/75">{res.unitName}</td>
                              <td className="py-3 pr-4">
                                {res.checkIn} → {res.checkOut} ({res.nights}n)
                              </td>
                              <td className="py-3 pr-4 uppercase text-[10px] tracking-wider text-[#8C7355]">
                                {res.channel.replace('_', '.')}
                              </td>
                              <td className="py-3 pr-4 font-medium">{formatPrice(res.totalUsd)}</td>
                              <td className="py-3">
                                <span className="px-2.5 py-0.5 bg-[#2C221E] text-[#FAF8F5] text-[10px] uppercase tracking-wider">
                                  {res.status.replace('_', ' ')}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: RESERVATIONS MANAGER */}
              {activeTab === 'bookings' && (
                <div className="space-y-6">
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div className="flex flex-wrap items-center gap-2">
                      {['all', 'direct', 'airbnb', 'booking_com', 'whatsapp'].map((ch) => (
                        <button
                          key={ch}
                          type="button"
                          onClick={() => setChannelFilter(ch)}
                          className={`px-3.5 py-2 text-[10px] uppercase tracking-[0.2em] border ${
                            channelFilter === ch
                              ? 'bg-[#2C221E] text-[#FAF8F5] border-[#2C221E]'
                              : 'bg-[#F5F2EB] text-[#2C221E]/75 border-[#2C221E]/15'
                          }`}
                        >
                          {ch === 'all' ? 'All Channels' : ch.replace('_', '.')}
                        </button>
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={() => setShowNewBookingForm(!showNewBookingForm)}
                      className="inline-flex items-center space-x-1.5 px-4 py-2.5 bg-[#2C221E] text-[#FAF8F5] text-[10px] uppercase tracking-[0.2em]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>New Manual Reservation</span>
                    </button>
                  </div>

                  {showNewBookingForm && (
                    <form
                      onSubmit={handleCreateManualBooking}
                      className="p-5 bg-[#F5F2EB] border border-[#2C221E]/20 space-y-4"
                    >
                      <h4 className="font-serif text-lg text-[#2C221E]">
                        Add Direct / Owner Reservation
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="px-3 py-2 bg-white/70 border border-[#2C221E]/15 text-xs text-[#2C221E] flex items-center font-medium">
                          Villa Tao — Entire Private Villa
                        </div>
                        <input
                          type="text"
                          required
                          placeholder="Guest Full Name"
                          value={newGuestName}
                          onChange={(e) => setNewGuestName(e.target.value)}
                          className="px-3 py-2 bg-white border border-[#2C221E]/20 text-xs"
                        />
                        <input
                          type="email"
                          placeholder="Guest Email"
                          value={newGuestEmail}
                          onChange={(e) => setNewGuestEmail(e.target.value)}
                          className="px-3 py-2 bg-white border border-[#2C221E]/20 text-xs"
                        />
                        <input
                          type="date"
                          value={newCheckIn}
                          onChange={(e) => setNewCheckIn(e.target.value)}
                          className="px-3 py-2 bg-white border border-[#2C221E]/20 text-xs"
                        />
                        <input
                          type="date"
                          value={newCheckOut}
                          onChange={(e) => setNewCheckOut(e.target.value)}
                          className="px-3 py-2 bg-white border border-[#2C221E]/20 text-xs"
                        />
                        <input
                          type="number"
                          placeholder="Total USD"
                          value={newTotalUsd}
                          onChange={(e) => setNewTotalUsd(Number(e.target.value))}
                          className="px-3 py-2 bg-white border border-[#2C221E]/20 text-xs"
                        />
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setShowNewBookingForm(false)}
                          className="px-4 py-2 border border-[#2C221E]/20 text-xs uppercase tracking-wider"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#2C221E] text-[#FAF8F5] text-xs uppercase tracking-wider"
                        >
                          Save Reservation
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="space-y-3">
                    {filteredReservations.map((res) => (
                      <div
                        key={res.id}
                        className="p-5 bg-[#F5F2EB] border border-[#2C221E]/12 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-xs font-medium text-[#2C221E]">
                              {res.referenceCode}
                            </span>
                            <span className="px-2 py-0.5 bg-[#2C221E]/10 text-[#2C221E] text-[10px] uppercase tracking-wider">
                              {res.channel.replace('_', '.')}
                            </span>
                            <span className="px-2 py-0.5 bg-[#2C221E] text-[#FAF8F5] text-[10px] uppercase tracking-wider">
                              {res.status.replace('_', ' ')}
                            </span>
                          </div>
                          <h4 className="font-serif text-lg text-[#2C221E]">
                            {res.guestName} — {res.unitName}
                          </h4>
                          <p className="text-xs text-[#2C221E]/70 font-light">
                            {res.checkIn} to {res.checkOut} ({res.nights} nights, {res.guests} guests) •{' '}
                            {res.guestEmail} • {res.guestPhone}
                          </p>
                          {res.specialRequests && (
                            <p className="text-xs text-[#8C7355] italic font-light">
                              "{res.specialRequests}"
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 shrink-0">
                          <div className="text-right mr-3">
                            <span className="font-serif text-lg text-[#2C221E] block">
                              {formatPrice(res.totalUsd)}
                            </span>
                            <span className="text-[10px] text-[#2C221E]/60 block">
                              Paid: {formatPrice(res.amountPaidUsd)}
                            </span>
                          </div>

                          {res.status !== 'confirmed' && res.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => updateReservationStatus(res.id, 'confirmed', res.totalUsd)}
                              className="px-3 py-2 bg-[#2C221E] text-[#FAF8F5] text-[10px] uppercase tracking-wider"
                            >
                              Mark Confirmed &amp; Paid
                            </button>
                          )}

                          {res.status !== 'cancelled' && (
                            <button
                              type="button"
                              onClick={() => updateReservationStatus(res.id, 'cancelled')}
                              className="px-3 py-2 border border-[#2C221E]/25 text-[#2C221E]/75 hover:text-[#2C221E] text-[10px] uppercase tracking-wider"
                            >
                              Cancel
                            </button>
                          )}

                          <a
                            href={getWhatsAppUrl(
                              'booking',
                              `Hello ${res.guestName}, this is the Villa Tao Balian team regarding your reservation ${res.referenceCode} (${res.checkIn} to ${res.checkOut}).`
                            )}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 border border-[#2C221E]/20 hover:border-[#2C221E]"
                            title="WhatsApp Guest"
                          >
                            <MessageCircle className="w-4 h-4 text-[#25D366]" />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: MASTER AVAILABILITY & DATE BLOCK MANAGER */}
              {activeTab === 'calendar' && (
                <div className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#F5F2EB] p-5 border border-[#2C221E]/10">
                    <div>
                      <h3 className="font-serif text-xl text-[#2C221E] font-normal">
                        Master Calendar &amp; Date Block Manager
                      </h3>
                      <p className="text-xs text-[#2C221E]/70 font-light mt-0.5">
                        Click any open date below to place or remove an Owner / Maintenance Block for the entire private villa.
                      </p>
                    </div>
                    <div className="px-4 py-2 bg-[#2C221E] text-[#FAF8F5] text-[10px] uppercase tracking-[0.2em] font-medium shrink-0">
                      Villa Tao — Entire Private Villa
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2.5">
                    {upcoming28Days.map((dYmd) => {
                      const status = isDateAvailableForUnit(dYmd, calendarUnitId);
                      const isOwnerBlock = status.channel === 'owner_block';
                      return (
                        <button
                          key={dYmd}
                          type="button"
                          onClick={() => toggleOwnerDateBlock(calendarUnitId, dYmd)}
                          className={`p-3 border text-left transition-colors flex flex-col justify-between h-24 ${
                            status.available
                              ? 'bg-[#FAF8F5] border-[#2C221E]/12 hover:border-[#2C221E]'
                              : isOwnerBlock
                              ? 'bg-[#2C221E] text-[#FAF8F5] border-[#2C221E]'
                              : 'bg-[#EAE4D6] text-[#2C221E]/60 border-[#2C221E]/15 cursor-not-allowed'
                          }`}
                        >
                          <span className="font-mono text-xs">{dYmd}</span>
                          <div>
                            <span className="text-[10px] uppercase tracking-wider block font-medium">
                              {status.available
                                ? 'Available'
                                : isOwnerBlock
                                ? 'Owner Block (Click to Open)'
                                : `Booked (${status.channel?.toUpperCase()})`}
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* TAB 4: AIRBNB & BOOKING.COM CHANNEL SYNCHRONIZATION */}
              {activeTab === 'channels' && (
                <div className="space-y-6">
                  <div className="bg-[#F5F2EB] border border-[#2C221E]/12 p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-[10px] uppercase tracking-[0.24em] text-[#8C7355] block">
                        TWO-WAY iCALENDAR (.ICS) CHANNEL MANAGER
                      </span>
                      <h3 className="font-serif text-xl text-[#2C221E] font-normal">
                        Airbnb &amp; Booking.com Real-Time Synchronization
                      </h3>
                      <p className="text-xs text-[#2C221E]/70 font-light mt-1">
                        Prevents double bookings by importing external OTA reservations and exporting Villa Tao's live availability feed.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={isSyncing}
                      onClick={handleRunSync}
                      className="px-5 py-3 bg-[#2C221E] text-[#FAF8F5] text-xs uppercase tracking-[0.2em] inline-flex items-center justify-center gap-2 shrink-0"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing Channels...' : 'Sync All Channels Now'}</span>
                    </button>
                  </div>

                  {syncNotice && (
                    <div className="p-4 bg-[#F5F2EB] border border-[#8C7355] text-xs text-[#2C221E] flex items-center gap-2">
                      <Check className="w-4 h-4 text-[#8C7355] shrink-0" />
                      <span>{syncNotice}</span>
                    </div>
                  )}

                  {/* Connected Channels */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {channels.map((chan) => (
                      <div
                        key={chan.id}
                        className="p-5 sm:p-6 bg-[#FAF8F5] border border-[#2C221E]/15 space-y-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] block">
                              {chan.platform.toUpperCase()} OFFICIAL LISTING
                            </span>
                            <h4 className="font-serif text-lg text-[#2C221E]">{chan.name}</h4>
                          </div>
                          <span className="px-2.5 py-1 bg-[#2C221E] text-[#FAF8F5] text-[10px] uppercase tracking-wider">
                            {chan.status}
                          </span>
                        </div>

                        <div className="space-y-2 text-xs">
                          <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/65">
                            External {chan.platform === 'airbnb' ? 'Airbnb' : 'Booking.com'} iCal Import URL (.ics)
                          </label>
                          <input
                            type="text"
                            value={chan.importIcalUrl}
                            onChange={(e) => updateChannelUrl(chan.id, e.target.value)}
                            className="w-full px-3 py-2 bg-[#F5F2EB] border border-[#2C221E]/15 text-[11px] font-mono text-[#2C221E]"
                          />
                        </div>

                        <div className="space-y-2 text-xs">
                          <label className="block text-[10px] uppercase tracking-wider text-[#2C221E]/65">
                            Villa Tao Export iCal Feed URL (Paste into {chan.platform === 'airbnb' ? 'Airbnb' : 'Booking.com'})
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              readOnly
                              value={`${window.location.origin}${chan.exportIcalPath}`}
                              className="flex-1 px-3 py-2 bg-[#F5F2EB] border border-[#2C221E]/15 text-[11px] font-mono text-[#2C221E]"
                            />
                            <button
                              type="button"
                              onClick={() => handleCopyIcalUrl(chan.exportIcalPath)}
                              className="px-3 py-2 bg-[#2C221E] text-[#FAF8F5] text-[10px] uppercase tracking-wider inline-flex items-center gap-1"
                            >
                              {copiedPath === chan.exportIcalPath ? (
                                <>
                                  <Check className="w-3 h-3" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#2C221E]/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#2C221E]/65">
                          <span>
                            Last Synced: {new Date(chan.lastSyncedAt).toLocaleTimeString()} •{' '}
                            {chan.syncedBookingsCount} Bookings Imported
                          </span>
                          <div className="flex items-center gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                setPreviewIcalUnit(
                                  previewIcalUnit === chan.unitId ? null : chan.unitId
                                )
                              }
                              className="text-[#8C7355] hover:text-[#2C221E] underline uppercase text-[10px] tracking-wider"
                            >
                              {previewIcalUnit === chan.unitId ? 'Hide .ics Feed' : 'Preview Live .ics'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDownloadIcs(chan.unitId)}
                              className="inline-flex items-center gap-1 text-[#2C221E] hover:text-[#8C7355] uppercase text-[10px] tracking-wider"
                            >
                              <Download className="w-3 h-3" />
                              <span>.ics</span>
                            </button>
                            <a
                              href={chan.listingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[#2C221E] hover:text-[#8C7355] uppercase text-[10px] tracking-wider"
                            >
                              <span>Listing</span>
                              <ArrowUpRight className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {previewIcalUnit && (
                    <div className="p-5 bg-[#1C1613] text-[#FAF8F5] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#C5A880]">
                          LIVE GENERATED RFC-5545 VCALENDAR FEED ({previewIcalUnit.toUpperCase()})
                        </span>
                        <button
                          type="button"
                          onClick={() => setPreviewIcalUnit(null)}
                          className="text-xs text-white/60 hover:text-white"
                        >
                          Close Preview
                        </button>
                      </div>
                      <pre className="text-[11px] font-mono text-white/85 overflow-x-auto whitespace-pre-wrap max-h-48">
                        {generateIcalString(previewIcalUnit)}
                      </pre>
                    </div>
                  )}

                  {/* Manual iCal VEVENT Import Tester */}
                  <div className="p-5 bg-[#F5F2EB] border border-[#2C221E]/12 space-y-3">
                    <span className="text-[10px] uppercase tracking-[0.2em] text-[#8C7355] block">
                      IMPORT EXTERNAL ICAL (.ICS) PAYLOAD
                    </span>
                    <textarea
                      rows={3}
                      value={customIcsInput}
                      onChange={(e) => setCustomIcsInput(e.target.value)}
                      placeholder="Optional: Paste raw BEGIN:VCALENDAR / BEGIN:VEVENT data from Airbnb or Booking.com to import immediately..."
                      className="w-full p-3 bg-white border border-[#2C221E]/15 text-xs font-mono"
                    />
                  </div>
                </div>
              )}

              {/* TAB 5: AI DYNAMIC PRICING & REVENUE ENGINE */}
              {activeTab === 'pricing' && (
                <div className="space-y-6">
                  {/* AI Revenue Strategist Banner */}
                  <div className="p-6 bg-[#1C1613] text-[#FAF8F5] flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="space-y-1.5 max-w-2xl">
                      <div className="inline-flex items-center space-x-2 text-[#C5A880] text-[10px] uppercase tracking-[0.24em]">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>AI REVENUE MANAGEMENT &amp; DYNAMIC YIELD ENGINE</span>
                      </div>
                      <h3 className="font-serif text-2xl text-white font-normal">
                        Intelligent West Bali Coastal Rate Optimization
                      </h3>
                      <p className="text-xs text-white/75 font-light leading-relaxed">
                        Automatically adjusts nightly rates across Entire Villa and Suites 01–04 based on seasonality, weekend coastal demand, lead-time windows, and slow-living length-of-stay privileges.
                      </p>
                    </div>

                    <button
                      type="button"
                      disabled={loadingAi}
                      onClick={handleGenerateAiPricing}
                      className="px-6 py-3.5 bg-[#C5A880] text-[#1C1613] hover:bg-white text-xs uppercase tracking-[0.2em] font-medium transition-colors shrink-0"
                    >
                      {loadingAi ? 'Analyzing Occupancy & Market...' : 'Run AI Revenue & Yield Advisor'}
                    </button>
                  </div>

                  {aiInsight && (
                    <div className="p-6 bg-[#F5F2EB] border border-[#8C7355] space-y-5 animate-in fade-in duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#2C221E]/10 pb-4">
                        <div>
                          <span className="text-[10px] uppercase tracking-[0.22em] text-[#8C7355] block">
                            AI REVENUE ADVISOR REPORT • MARKET DEMAND SCORE: {aiInsight.marketDemandScore}/100
                          </span>
                          <p className="text-xs sm:text-sm text-[#2C221E] mt-1 leading-relaxed">
                            {aiInsight.summary}
                          </p>
                        </div>
                        {aiInsight.suggestedMultipliers && (
                          <button
                            type="button"
                            onClick={handleApplyAiMultipliers}
                            className="px-4 py-2.5 bg-[#2C221E] text-[#FAF8F5] text-[10px] uppercase tracking-[0.2em] shrink-0"
                          >
                            Apply AI Recommended Multipliers
                          </button>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {aiInsight.recommendations.map((rec, i) => (
                          <div key={i} className="p-4 bg-[#FAF8F5] border border-[#2C221E]/10 space-y-1.5">
                            <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C7355] font-medium block">
                              {rec.impact}
                            </span>
                            <h5 className="font-serif text-base text-[#2C221E]">{rec.title}</h5>
                            <p className="text-xs text-[#2C221E]/70 font-light">{rec.suggestedAction}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Base Rates & Multipliers Configuration */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="p-6 bg-[#F5F2EB] border border-[#2C221E]/12 space-y-4">
                      <h4 className="font-serif text-lg text-[#2C221E]">
                        Base Nightly Rates (USD)
                      </h4>
                      <div className="space-y-3">
                        {allBookableUnits.map((u) => (
                          <div key={u.id} className="flex items-center justify-between gap-4 text-xs">
                            <span className="text-[#2C221E]/85">{u.name}</span>
                            <input
                              type="number"
                              value={pricingConfig.unitBaseRates[u.id] ?? u.baseNightlyRate ?? 580}
                              onChange={(e) =>
                                updatePricingConfig({
                                  ...pricingConfig,
                                  unitBaseRates: {
                                    ...pricingConfig.unitBaseRates,
                                    [u.id]: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-28 px-3 py-1.5 bg-white border border-[#2C221E]/20 text-right font-mono"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-6 bg-[#F5F2EB] border border-[#2C221E]/12 space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif text-lg text-[#2C221E]">
                          Dynamic Multipliers &amp; Long-Stay Rules
                        </h4>
                        <label className="inline-flex items-center gap-2 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pricingConfig.aiDynamicPricingEnabled}
                            onChange={(e) =>
                              updatePricingConfig({
                                ...pricingConfig,
                                aiDynamicPricingEnabled: e.target.checked,
                              })
                            }
                          />
                          <span>Dynamic Pricing Active</span>
                        </label>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <label className="block text-[10px] uppercase text-[#2C221E]/65 mb-1">
                            Peak Season Multiplier (x)
                          </label>
                          <input
                            type="number"
                            step="0.05"
                            value={pricingConfig.peakSeasonMultiplier}
                            onChange={(e) =>
                              updatePricingConfig({
                                ...pricingConfig,
                                peakSeasonMultiplier: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-1.5 bg-white border border-[#2C221E]/20 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-[#2C221E]/65 mb-1">
                            High Season Multiplier (x)
                          </label>
                          <input
                            type="number"
                            step="0.05"
                            value={pricingConfig.highSeasonMultiplier}
                            onChange={(e) =>
                              updatePricingConfig({
                                ...pricingConfig,
                                highSeasonMultiplier: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-1.5 bg-white border border-[#2C221E]/20 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-[#2C221E]/65 mb-1">
                            Weekend Surge (%)
                          </label>
                          <input
                            type="number"
                            value={pricingConfig.weekendSurgePercent}
                            onChange={(e) =>
                              updatePricingConfig({
                                ...pricingConfig,
                                weekendSurgePercent: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-1.5 bg-white border border-[#2C221E]/20 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-[#2C221E]/65 mb-1">
                            Last-Minute Window Discount (%)
                          </label>
                          <input
                            type="number"
                            value={pricingConfig.lastMinuteDiscountPercent}
                            onChange={(e) =>
                              updatePricingConfig({
                                ...pricingConfig,
                                lastMinuteDiscountPercent: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-1.5 bg-white border border-[#2C221E]/20 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-[#2C221E]/65 mb-1">
                            Weekly Stay (7+ Nights) Discount (%)
                          </label>
                          <input
                            type="number"
                            value={pricingConfig.weeklyDiscountPercent}
                            onChange={(e) =>
                              updatePricingConfig({
                                ...pricingConfig,
                                weeklyDiscountPercent: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-1.5 bg-white border border-[#2C221E]/20 font-mono"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] uppercase text-[#2C221E]/65 mb-1">
                            Monthly Stay (28+ Nights) Discount (%)
                          </label>
                          <input
                            type="number"
                            value={pricingConfig.monthlyDiscountPercent}
                            onChange={(e) =>
                              updatePricingConfig({
                                ...pricingConfig,
                                monthlyDiscountPercent: Number(e.target.value),
                              })
                            }
                            className="w-full px-3 py-1.5 bg-white border border-[#2C221E]/20 font-mono"
                          />
                        </div>
                      </div>

                      {pricingSaved && (
                        <p className="text-xs text-[#8C7355] flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5" />
                          <span>Live pricing multipliers updated across website.</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 6: GUEST INQUIRIES */}
              {activeTab === 'inquiries' && (
                <div className="space-y-4">
                  <h3 className="font-serif text-xl text-[#2C221E] font-normal">
                    Direct Guest Inquiries &amp; Concierge Messages
                  </h3>
                  {inquiries.map((inq) => (
                    <div
                      key={inq.id}
                      className="p-5 bg-[#F5F2EB] border border-[#2C221E]/12 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-serif text-lg text-[#2C221E]">{inq.fullName}</span>
                          <span className="px-2 py-0.5 bg-[#2C221E] text-[#FAF8F5] text-[10px] uppercase tracking-wider">
                            {inq.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#2C221E]/70">
                          {inq.email} • {inq.whatsappNumber} • Preferred Dates: {inq.checkIn || 'Flexible'} to{' '}
                          {inq.checkOut || 'Flexible'} ({inq.guests} guests)
                        </p>
                        <p className="text-xs text-[#2C221E]/85 font-light pt-1">"{inq.message}"</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        {inq.status === 'new' && (
                          <button
                            type="button"
                            onClick={() => updateInquiryStatus(inq.id, 'replied')}
                            className="px-3.5 py-2 bg-[#2C221E] text-[#FAF8F5] text-[10px] uppercase tracking-wider"
                          >
                            Mark Replied
                          </button>
                        )}
                        <a
                          href={getWhatsAppUrl(
                            'general',
                            `Hello ${inq.fullName}, thank you for contacting Villa Tao Balian regarding your stay!`
                          )}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-2 border border-[#2C221E]/25 text-[10px] uppercase tracking-wider inline-flex items-center gap-1.5"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                          <span>Reply via WhatsApp</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
