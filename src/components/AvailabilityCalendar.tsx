import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, RefreshCw } from 'lucide-react';
import { useBooking, formatDateYMD, diffNights, addDaysYMD } from '../context/BookingContext';

interface AvailabilityCalendarProps {
  unitId?: string;
  checkIn: string;
  checkOut: string;
  onSelectDates: (checkIn: string, checkOut: string) => void;
  compact?: boolean;
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const AvailabilityCalendar: React.FC<AvailabilityCalendarProps> = ({
  unitId = 'entire-villa',
  checkIn,
  checkOut,
  onSelectDates,
  compact = false,
}) => {
  const { isDateAvailableForUnit, isDateRangeAvailable, getNightlyRateForDate, formatPrice, pricingConfig } = useBooking();

  const today = useMemo(() => new Date(), []);
  const [viewMonthOffset, setViewMonthOffset] = useState(0);
  const [selectingStep, setSelectingStep] = useState<'checkIn' | 'checkOut'>('checkIn');
  const [rangeError, setRangeError] = useState<string | null>(null);

  const buildMonthDays = (offset: number) => {
    const firstOfMonth = new Date(today.getFullYear(), today.getMonth() + offset, 1);
    const year = firstOfMonth.getFullYear();
    const month = firstOfMonth.getMonth();
    const startWeekday = firstOfMonth.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const cells: Array<{ dateYmd: string | null; dayNum: number | null }> = [];
    for (let i = 0; i < startWeekday; i++) {
      cells.push({ dateYmd: null, dayNum: null });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const ymd = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      cells.push({ dateYmd: ymd, dayNum: d });
    }
    return {
      title: `${MONTH_NAMES[month]} ${year}`,
      cells,
    };
  };

  const month1 = useMemo(() => buildMonthDays(viewMonthOffset), [viewMonthOffset, today]);
  const month2 = useMemo(() => buildMonthDays(viewMonthOffset + 1), [viewMonthOffset, today]);

  const handleDateClick = (dateYmd: string) => {
    setRangeError(null);
    const status = isDateAvailableForUnit(dateYmd, unitId);

    if (selectingStep === 'checkIn' || !checkIn || dateYmd <= checkIn) {
      if (!status.available) {
        setRangeError('Selected date is already reserved. Please choose an available check-in date.');
        return;
      }
      // Find a clean default checkOut (minNightsStandard days later if available, else 1 night)
      const minNights = pricingConfig.minNightsStandard || 2;
      const proposedOut = addDaysYMD(dateYmd, minNights);
      const rangeCheck = isDateRangeAvailable(unitId, dateYmd, proposedOut);
      if (rangeCheck.available) {
        onSelectDates(dateYmd, proposedOut);
      } else {
        onSelectDates(dateYmd, addDaysYMD(dateYmd, 1));
      }
      setSelectingStep('checkOut');
    } else {
      // Setting checkOut
      const nights = diffNights(checkIn, dateYmd);
      if (nights < 1) {
        onSelectDates(dateYmd, addDaysYMD(dateYmd, 2));
        setSelectingStep('checkOut');
        return;
      }
      const rangeCheck = isDateRangeAvailable(unitId, checkIn, dateYmd);
      if (!rangeCheck.available) {
        // If range crosses a booked date, start a fresh check-in on the clicked date if available
        if (status.available) {
          onSelectDates(dateYmd, addDaysYMD(dateYmd, 2));
          setSelectingStep('checkOut');
          setRangeError('Adjusted check-in date as the previous range overlapped reserved dates.');
        } else {
          setRangeError('Those dates overlap an existing reservation. Please select open dates.');
        }
        return;
      }
      onSelectDates(checkIn, dateYmd);
      setSelectingStep('checkIn');
    }
  };

  const renderMonth = (monthData: { title: string; cells: Array<{ dateYmd: string | null; dayNum: number | null }> }) => (
    <div className="w-full">
      <div className="text-center font-serif text-base sm:text-lg text-[#2C221E] font-normal mb-3 tracking-wide">
        {monthData.title}
      </div>
      <div className="grid grid-cols-7 gap-1 mb-1.5">
        {WEEKDAYS.map((w) => (
          <div
            key={w}
            className="text-center text-[10px] uppercase tracking-[0.18em] text-[#2C221E]/50 font-normal py-1"
          >
            {w}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {monthData.cells.map((cell, idx) => {
          if (!cell.dateYmd || !cell.dayNum) {
            return <div key={`empty-${idx}`} className="h-11 sm:h-12" />;
          }

          const dYmd = cell.dateYmd;
          const avail = isDateAvailableForUnit(dYmd, unitId);
          const isCheckIn = dYmd === checkIn;
          const isCheckOut = dYmd === checkOut;
          const isInRange = checkIn && checkOut && dYmd > checkIn && dYmd < checkOut;
          const nightlyRate = getNightlyRateForDate(unitId, dYmd);

          // Note: A date that is booked cannot be checkIn or inRange, but CAN be a checkOut morning if previous night was open
          const canBeCheckoutMorning =
            selectingStep === 'checkOut' &&
            checkIn &&
            dYmd > checkIn &&
            isDateRangeAvailable(unitId, checkIn, dYmd).available;

          const isInteractive = avail.available || canBeCheckoutMorning;

          return (
            <button
              key={dYmd}
              type="button"
              disabled={!isInteractive}
              onClick={() => handleDateClick(dYmd)}
              className={`relative h-11 sm:h-12 flex flex-col items-center justify-center transition-colors text-xs ${
                isCheckIn || isCheckOut
                  ? 'bg-[#2C221E] text-[#FAF8F5] font-medium'
                  : isInRange
                  ? 'bg-[#EAE4D6] text-[#2C221E]'
                  : avail.available
                  ? 'bg-[#FAF8F5] hover:bg-[#EAE4D6]/70 text-[#2C221E] border border-[#2C221E]/8'
                  : canBeCheckoutMorning
                  ? 'bg-[#FAF8F5]/80 hover:bg-[#EAE4D6] text-[#2C221E] border border-dashed border-[#8C7355]'
                  : 'bg-[#F0ECE3]/60 text-[#2C221E]/30 cursor-not-allowed line-through'
              }`}
              title={
                avail.available
                  ? `${dYmd}: Available (${formatPrice(nightlyRate)}/night)`
                  : `${dYmd}: Reserved`
              }
            >
              <span className="leading-none">{cell.dayNum}</span>
              {avail.available && !compact && (
                <span
                  className={`text-[9px] mt-0.5 leading-none tracking-tighter ${
                    isCheckIn || isCheckOut ? 'text-[#C5A880]' : 'text-[#2C221E]/50'
                  }`}
                >
                  {formatPrice(nightlyRate)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <div className="bg-[#F5F2EB] border border-[#2C221E]/10 p-4 sm:p-6">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-[#2C221E]/10">
        <div>
          <span className="text-[10px] uppercase tracking-[0.24em] text-[#8C7355] block">
            REAL-TIME AVAILABILITY &amp; DYNAMIC RATES
          </span>
          <p className="text-xs text-[#2C221E]/65 font-light mt-0.5 flex items-center gap-1.5">
            <RefreshCw className="w-3 h-3 text-[#8C7355]" />
            <span>Synchronized with Direct Calendar, Airbnb &amp; Booking.com</span>
          </p>
        </div>

        <div className="flex items-center space-x-2 self-end sm:self-auto">
          <button
            type="button"
            disabled={viewMonthOffset <= 0}
            onClick={() => setViewMonthOffset((prev) => Math.max(0, prev - 1))}
            className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center border border-[#2C221E]/15 bg-[#FAF8F5] text-[#2C221E] disabled:opacity-30 hover:bg-[#EAE4D6] transition-colors"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMonthOffset((prev) => prev + 1)}
            className="p-2 min-w-[38px] min-h-[38px] flex items-center justify-center border border-[#2C221E]/15 bg-[#FAF8F5] text-[#2C221E] hover:bg-[#EAE4D6] transition-colors"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Calendar Grid: 1 month on mobile/compact, 2 months side-by-side on desktop */}
      <div className={`grid grid-cols-1 ${compact ? '' : 'lg:grid-cols-2'} gap-6 sm:gap-8`}>
        {renderMonth(month1)}
        {!compact && <div className="hidden lg:block">{renderMonth(month2)}</div>}
      </div>

      {/* Legend & Status */}
      <div className="mt-5 pt-3.5 border-t border-[#2C221E]/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#2C221E]/70 font-light">
        <div className="flex flex-wrap items-center gap-4">
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#FAF8F5] border border-[#2C221E]/20 inline-block" />
            <span>Available</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#2C221E] inline-block" />
            <span>Selected Dates</span>
          </span>
          <span className="inline-flex items-center gap-1.5">
            <span className="w-3 h-3 bg-[#F0ECE3] border border-[#2C221E]/10 inline-block" />
            <span>Reserved (Direct / Airbnb / Booking.com)</span>
          </span>
        </div>

        <span className="text-[10px] uppercase tracking-[0.18em] text-[#8C7355]">
          {selectingStep === 'checkOut' ? 'Select Check-Out Date' : 'Select Check-In Date'}
        </span>
      </div>

      {rangeError && (
        <p className="mt-2.5 text-xs text-[#8C7355] font-light">{rangeError}</p>
      )}
    </div>
  );
};
