"use client"
import { useTranslation } from "react-i18next"

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">{t("modal.confirmDeletion")}</h2>
        <p className="mb-6 text-gray-700">{t("modal.deleteConfirmMessage")}</p>
        <div className="flex justify-end space-x-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400">
            {t("common.actions.cancel")}
          </button>
          <button onClick={onConfirm} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            {t("common.actions.delete")}
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteConfirmationModal
