import { AnimatePresence, motion } from 'framer-motion'
import PropTypes from 'prop-types'
import { useNavigate } from 'react-router-dom'

export const ModalCategory = ({ isOpenCategory, categoryList }) => {
  const navigate = useNavigate()
  return (
    <AnimatePresence>
      {isOpenCategory && (
        <motion.div
          // onHoverStart={onHoverStart}
          // onHoverEnd={onHoverEnd}
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ duration: 0.3 }}
          className="bg-white absolute top-[102px] rounded-lg pb-2 pt-1 shadow-[0px_2px_3px_-1px_rgba(0,0,0,0.1),0px_1px_0px_0px_rgba(25,28,33,0.02),0px_0px_0px_1px_rgba(25,28,33,0.08)]">
          <div className="flex flex-col gap-0.5">
            <div className="px-4 font-semibold text-[15px] text-[#343538] py-1.5 border-b border-gray-200">All Category</div>
            {categoryList.map((item, index) => (
              <>
                <div key={index} className="group border-l-2 border-white py-1 hover:border-[#3A826E] hover:bg-[#F0FAF7]">
                  <span
                    onClick={() => navigate(`/catalogue/${item.id}`)}
                    className="px-4 text-[15px] font-medium group-hover:font-semibold text-gray-600 group-hover:text-[#3A826E]">
                    {item.name}
                  </span>
                </div>
              </>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

ModalCategory.propTypes = {
  isOpenCategory: PropTypes.bool.isRequired,
  categoryList: PropTypes.array.isRequired
}
