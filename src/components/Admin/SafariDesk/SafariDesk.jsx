import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './Sidebar';
import RequestList from './RequestList';
import { motion } from 'framer-motion';
import api from '../../../api/axios';
import { io } from 'socket.io-client';
import {
  listItemsFromResponse,
  paginationFromResponse,
  workflowCountsFromResponse,
  scopeTotalFromPagination,
} from '../../../utils/apiList';

function buildDeskTabCounts(workflowCounts, pagination) {
  const w = workflowCounts || {};
  const totalAll = scopeTotalFromPagination(pagination);
  const newC = w.NEW || 0;
  const working =
    (w.ASSIGNED || 0) + (w.QUOTE_SENT || 0) + (w.PENDING_CONFIRMATION || 0);
  const open = newC + working;
  return {
    Everything: totalAll,
    New: newC,
    'Working On': working,
    Open: open,
    Booked: w.CONFIRMED || 0,
    Completed: w.COMPLETED || 0,
    'Not Booked': w.CANCELLED || 0,
  };
}

const SafariDesk = () => {
  const [activeTab, setActiveTab] = useState('Everything');
  const [bookings, setBookings] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [workflowCounts, setWorkflowCounts] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        limit: '150',
        page: '1',
        type: 'PACKAGE',
      });
      if (activeTab === 'New') params.set('workflowStatus', 'NEW');
      else if (activeTab === 'Working On') {
        params.set('workflowStatuses', 'ASSIGNED,QUOTE_SENT,PENDING_CONFIRMATION');
      } else if (activeTab === 'Open') {
        params.set(
          'workflowStatuses',
          'NEW,ASSIGNED,QUOTE_SENT,PENDING_CONFIRMATION'
        );
      } else if (activeTab === 'Booked') {
        params.set('workflowStatus', 'CONFIRMED');
      } else if (activeTab === 'Completed') {
        params.set('workflowStatus', 'COMPLETED');
      } else if (activeTab === 'Not Booked') {
        params.set('workflowStatus', 'CANCELLED');
      }

      const response = await api.get(`/bookings?${params.toString()}`);
      const rows = listItemsFromResponse(response).filter(
        (b) => (b.type || 'PACKAGE') === 'PACKAGE'
      );
      setBookings(rows);
      setPagination(paginationFromResponse(response));
      setWorkflowCounts(workflowCountsFromResponse(response));
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    setLoading(true);
    fetchBookings();
  }, [fetchBookings]);

  useEffect(() => {
    const socketUrl =
      import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000';
    const socket = io(socketUrl);

    socket.on('newBooking', fetchBookings);
    socket.on('bookingUpdated', fetchBookings);
    socket.on('statsUpdate', fetchBookings);

    return () => {
      socket.disconnect();
    };
  }, [fetchBookings]);

  const tabCounts = buildDeskTabCounts(workflowCounts, pagination);

  return (
    <div className="flex bg-[#0F111A]/60 backdrop-blur-2xl rounded-[3rem] shadow-[0_40px_100px_rgba(0,0,0,0.6)] border border-white/5 min-h-[calc(100vh-200px)] overflow-hidden">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookings={bookings}
        tabCounts={tabCounts}
      />

      <main className="flex-1 p-12 bg-transparent overflow-hidden flex flex-col space-y-10 relative">
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/5 blur-[100px] -z-10" />

        <header className="flex flex-col gap-3 relative z-10">
          <div className="flex items-center gap-4">
            <h1 className="text-5xl font-serif text-white tracking-tight">
              Safari<span className="italic text-accent">Desk</span>
            </h1>
            <div className="h-px w-24 bg-gradient-to-r from-accent/40 to-transparent" />
          </div>
          <div className="flex items-center gap-3">
            <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
            <p className="text-[10px] font-black text-accent uppercase tracking-[0.4em]">
              Strategic Request Operations
            </p>
          </div>
        </header>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 min-h-0 relative z-10"
        >
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full gap-6">
              <div className="w-16 h-16 border-2 border-accent/20 border-t-accent rounded-full animate-spin" />
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">
                Initialising Desk...
              </p>
            </div>
          ) : (
            <RequestList activeTab={activeTab} bookings={bookings} />
          )}
        </motion.div>
      </main>
    </div>
  );
};

export default SafariDesk;
