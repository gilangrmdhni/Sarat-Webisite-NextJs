// Import statements (sesuaikan dengan kebutuhan)
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUpload } from '@fortawesome/free-solid-svg-icons';

const SubmitSaratFormInput = ({ formData, setFormData, sessionOptions, institutionOptions, handleChange, handleImageChange, handleNextPage }) => {
    const router = useRouter();

    return (
        <Layout>
            <div className="bg-white min-h-full">
                <div className="w-full p-4 flex items-center justify-between bg-red-800 text-white">
                    <FontAwesomeIcon icon={faArrowLeft} style={{ width: '20px', height: '20px' }} onClick={() => router.back()} />
                    <h2 className="text-lg font-semibold">Submit Sarat - Form Input</h2>
                    <div className="w-6" />
                </div>
                <div className="p-4">
                    <form className="max-w-md mx-auto">
                        {/* Form Inputs */}
                        <div className="mb-4">
                            <label htmlFor="session_detail_id" className="block text-sm font-semibold text-gray-600 mb-1">Pilih Sesi:</label>
                            <select
                                id="session_detail_id"
                                name="session_detail_id"
                                value={formData.session_detail_id}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                            >
                                <option value="" disabled>Pilih Sesi</option>
                                {sessionOptions.map((session) => (
                                    <option key={session.id} value={session.id}>{session.title} : {session.description}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="parent_name" className="block text-sm font-semibold text-gray-600 mb-1">Nama Wali Murid:</label>
                            <input
                                type="text"
                                id="parent_name"
                                name="parent_name"
                                value={formData.parent_name}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="student_name" className="block text-sm font-semibold text-gray-600 mb-1">Nama Murid:</label>
                            <input
                                type="text"
                                id="student_name"
                                name="student_name"
                                value={formData.student_name}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="student_class" className="block text-sm font-semibold text-gray-600 mb-1">Kelas Murid:</label>
                            <input
                                type="text"
                                id="student_class"
                                name="student_class"
                                value={formData.student_class}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="parent_type" className="block text-sm font-semibold text-gray-600 mb-1">Status Wali Murid:</label>
                            <select
                                id="parent_type"
                                name="parent_type"
                                value={formData.parent_type}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                            >
                                <option value="" disabled>Status Wali Murid</option>
                                <option value="Ayah">Ayah</option>
                                <option value="Bunda">Bunda</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="parent_phone" className="block text-sm font-semibold text-gray-600 mb-1">Nomor HP Wali Murid:</label>
                            <input
                                type="text"
                                id="parent_phone"
                                name="parent_phone"
                                value={formData.parent_phone}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="attendance_type" className="block text-sm font-semibold text-gray-600 mb-1">
                                Pilih Jenis Kehadiran:
                            </label>
                            <select
                                id="attendance_type"
                                name="attendance_type"
                                value={formData.attendance_type}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                            >
                                <option value="Hadir Offline">Hadir Offline</option>
                                <option value="Hadir Online">Hadir Online</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label htmlFor="start_time" className="block text-sm font-semibold text-gray-600 mb-1">Jam Mulai:</label>
                            <input
                                type="time"
                                id="start_time"
                                name="start_time"
                                value={formData.start_time}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="end_time" className="block text-sm font-semibold text-gray-600 mb-1">Jam Selesai :</label>
                            <input
                                type="time"
                                id="end_time"
                                name="end_time"
                                value={formData.end_time}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="reason_late" className="block text-sm font-semibold text-gray-600 mb-1">Alasan Terlambat:</label>
                            <input
                                type="text"
                                id="reason_late"
                                name="reason_late"
                                value={formData.reason_late}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="resume" className="block text-sm font-semibold text-gray-600 mb-1">Resume:</label>
                            <textarea
                                id="resume"
                                name="resume"
                                value={formData.resume}
                                onChange={handleChange}
                                rows="4"
                                className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label htmlFor="institution_id" className="block text-sm font-semibold text-gray-600 mb-1">Pilih Institusi:</label>
                            <select
                                id="institution_id"
                                name="institution_id"
                                value={formData.institution_id}
                                onChange={handleChange}
                                className="w-full p-3 border rounded-md focus:outline-none focus:border-red-500"
                            >
                                <option value="" disabled>Select Institution</option>
                                {institutionOptions.map((institution) => (
                                    <option key={institution.id} value={institution.id}>{institution.name}</option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="resume_file" className="block text-sm font-semibold text-gray-600 mb-1">Upload Resume:</label>
                            <label className="relative cursor-pointer text-center">
                                <input
                                    type="file"
                                    id="resume_file"
                                    name="resume_file"
                                    onChange={handleImageChange}
                                    accept=".pdf, .doc, .docx, .png, .jpg, .jpeg" // Accept multiple file types
                                    className="hidden"
                                />
                                <div className="bg-gray-100 hover:bg-gray-200 p-3 border rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center">
                                    <FontAwesomeIcon icon={faUpload} className="mr-2" style={{ width: '15px', height: '15px' }} />
                                    <span>Choose File</span>
                                </div>
                            </label>
                        </div>

                        {/* Preview Image */}
                        {formData.resume_file && (
                            <div className="mb-4">
                                <label className="block text-sm font-semibold text-gray-600 mb-1">Nama File:</label>
                                <p>{formData.resume_file.name}</p>
                            </div>
                        )}
                        {/* Submit Button */}
                        <button
                            type="button"
                            onClick={handleNextPage}
                            className="w-full bg-red-800 text-white py-3 px-4 rounded-md hover:bg-red-600"
                        >
                            Next
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default SubmitSaratFormInput;
