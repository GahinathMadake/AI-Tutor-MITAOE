import React, { createContext, useEffect, useState } from 'react';
import type { Semester, School, studentSiteHomeContextType} from '@/types/StudentSiteHome';
import { API_BASE } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

export const StudentSiteHomeContext = createContext<studentSiteHomeContextType | undefined>(undefined);

const schoolCache = new Map<string, School>();

export const StudentSiteHomeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { token } = useAuth();

    const [semesters, setSemesters] = useState<Semester[]>([]);
    const [isSemesterLoading, setIsSemesterLoading] = useState<boolean>(false);

    const fetchSemesters = async () => {
        if (!token) return;
        setIsSemesterLoading(true);

        try {
            const res = await fetch(`${API_BASE}/student/semester/get-all-semester`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();

            if (data.success) setSemesters(data.data.semesters);
        } catch (err) {
            console.error('Error fetching semesters:', err);
        } finally {
            setTimeout(() => setIsSemesterLoading(false), 300);
        }
    };

    const fetchSchoolById = async (id: string): Promise<School | undefined> => {
        if (!token) return;

        if (schoolCache.has(id)) {
            const cachedSchool = schoolCache.get(id)!;
            return cachedSchool;
        }

        try {
            const res = await fetch(`${API_BASE}/student/school/get-school-by-id/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const data = await res.json();

            if (data.success) {
                const fetchedSchool = data.data.school;
                schoolCache.set(id, fetchedSchool);
                return fetchedSchool;
            }
        } catch (err) {
            console.error('Error fetching school:', err);
        }

        return undefined;
    };


    useEffect(() => {
        if (token) {
            fetchSemesters();
        }
    }, [token]);

    return (
        <StudentSiteHomeContext.Provider
            value={{
                semesters,
                isSemesterLoading,
                fetchSchoolById,
            }}
        >
            {children}
        </StudentSiteHomeContext.Provider>
    );
};

