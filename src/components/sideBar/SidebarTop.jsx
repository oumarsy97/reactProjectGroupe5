import React from 'react';
import FilterButtons from "../Post/FilterButtons";

const SidebarTop = ({ activeFilter, setActiveFilter }) => (
    <div className="col-span-3">
        <div className="sticky top-24 space-y-4">
            <FilterButtons activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
        </div>
    </div>
);

export default SidebarTop;
