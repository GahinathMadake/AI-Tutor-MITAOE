import DashboardLayout from '@/components/layout/DashboardLayout';
import React from 'react';

const TestHistory: React.FC = () => {
    return (
        <DashboardLayout
            breadcrumbItems={[
                { label: "Dashboard", isCurrentPage: false, href: "/dashboard" },
                { label: `Test-History`, isCurrentPage: true },
            ]}
        >
            <div>
                Welcome to test History Page
            </div>
        </DashboardLayout>
    )
}

export default TestHistory;
