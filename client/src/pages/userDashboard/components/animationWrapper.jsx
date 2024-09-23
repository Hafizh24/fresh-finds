import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

export const AnimationWrapper = ({ selectedOption, index, children }) => {
    const isActive = selectedOption === index;

    return (
        <motion.div
            key={index}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -50 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            style={{ display: isActive ? 'block' : 'none' }}
        >
            {children}
        </motion.div>
    )
}

AnimationWrapper.propTypes = {
    selectedOption: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    children: PropTypes.node.isRequired,
};