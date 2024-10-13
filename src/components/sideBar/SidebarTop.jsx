import React from 'react';
import PropTypes from 'prop-types';
import FilterButtons from "../Post/FilterButtons";
import ChatApp from "../Story/StoryComponent";

const SidebarTop = ({ activeFilter, setActiveFilter, className, sticky = true }) => {
    const stickyClass = sticky ? 'sticky top-24' : '';

    return (
        <div className={`col-span-3 ${className}`}>
            <ChatApp />
            <div className={`${stickyClass} space-y-4`}>
                <FilterButtons
                    activeFilter={activeFilter}
                    setActiveFilter={setActiveFilter}
                />
                {/* Espace pour du contenu supplémentaire */}
            </div>
        </div>
    );
};

SidebarTop.propTypes = {
    activeFilter: PropTypes.string.isRequired,
    setActiveFilter: PropTypes.func.isRequired,
    className: PropTypes.string,
    sticky: PropTypes.bool
};

export default SidebarTop;