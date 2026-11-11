import React from 'react';
import { Building2, Clock, Phone, Mail, MapPin, Shield, CheckCircle, Package, ArrowRight } from 'lucide-react';
import { CampusStation } from '../types';

interface CampusStationsViewProps {
  stations: CampusStation[];
  onFilterByBuilding: (building: string) => void;
}

export const CampusStationsView: React.FC<CampusStationsViewProps> = ({
  stations,
  onFilterByBuilding
}) => {
  const deskImgPath = "/src/assets/images/campus_desk_station_1794391609321.jpg";

  return (
    <div className="space-y-8 pb-16">
      {/* Overview Banner */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-0 items-stretch">
        <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
              <Building2 className="w-4 h-4" />
              <span>Campus Physical Intake & Handover Points</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-900 leading-tight">
              Official Campus Lost & Found Desks
            </h2>
            <p className="text-sm text-neutral-600 leading-relaxed">
              Found belongings across academic halls, dining facilities, and dormitories are cataloged and delivered to designated central security and front-desk repositories. To collect verified items, visit the holding station during operational hours with your digital Claim Pass.
            </p>
          </div>

          <div className="pt-6 border-t border-neutral-100 flex flex-wrap gap-4 text-xs text-neutral-600">
            <div className="flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-neutral-800" />
              <span>Official Photo ID Required for Retrieval</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Package className="w-4 h-4 text-neutral-800" />
              <span>Items Retained for 90 Days</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
          <img
            src={deskImgPath}
            alt="University student information and security desk"
            className="w-full h-full object-cover object-center"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Stations Directory */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stations.map(station => (
          <div
            key={station.id}
            className="bg-white rounded-xl border border-neutral-200 p-6 flex flex-col justify-between shadow-xs hover:border-neutral-300 transition-colors"
          >
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
                  <span>{station.building}</span>
                  <span className="font-mono text-neutral-900 font-semibold bg-neutral-100 px-2 py-0.5 rounded">
                    {station.custodyItemCount} in safe custody
                  </span>
                </div>
                <h3 className="text-base font-bold text-neutral-900">
                  {station.name}
                </h3>
              </div>

              <div className="space-y-2 text-xs text-neutral-600">
                <div className="flex items-start gap-2">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                  <span>{station.room}</span>
                </div>

                <div className="flex items-start gap-2">
                  <Clock className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                  <span>{station.hours}</span>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                  <span className="font-mono">{station.phone}</span>
                </div>

                <div className="flex items-start gap-2">
                  <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                  <span className="font-mono">{station.email}</span>
                </div>
              </div>

              <div className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 text-[11px] text-neutral-600 leading-relaxed">
                <span className="font-semibold text-neutral-800">Intake Note: </span>
                {station.pickupInstructions}
              </div>
            </div>

            <div className="pt-4 border-t border-neutral-100 mt-4">
              <button
                onClick={() => onFilterByBuilding(station.building)}
                className="w-full py-2 text-xs font-semibold text-neutral-800 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Items Held Here</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
