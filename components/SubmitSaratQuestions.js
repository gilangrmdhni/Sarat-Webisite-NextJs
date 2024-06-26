import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUpload } from '@fortawesome/free-solid-svg-icons';

const SubmitSaratFormQuestions = ({ formData, questions, handleChange, handleImageChange, handlePrevPage, handleSubmit }) => {
    const router = useRouter();
    console.log('Questions:', questions);

    return (
        <Layout>
            <div className="min-h-screen flex flex-col">
                <div className="w-full p-4 flex items-center justify-between bg-red-800 text-white">
                    <FontAwesomeIcon icon={faArrowLeft} style={{ width: '20px', height: '20px' }} onClick={() => router.back()} />
                    <h2 className="text-lg font-semibold">Submit Sarat - Form Questions</h2>
                    <div className="w-6" />
                </div>
                <div className="flex-grow p-4 flex items-center justify-center">
                    <form onSubmit={handleSubmit} className="max-w-md w-full">
                        {/* Render questions and answer options */}
                        {questions.length > 0 ? (
                            questions.map((question) => (
                                <div key={question.id}>
                                    <fieldset className="mb-4">
                                        <legend className="block text-sm font-semibold text-gray-600 mb-1">{question.description}</legend>
                                        <ul>
                                            {question.question_details.map((choice) => (
                                                <li key={choice.id}>
                                                    <input
                                                        type="radio"
                                                        id={`choice_${choice.id}`}
                                                        name={`question_${question.id}`}
                                                        value={choice.id}
                                                        onChange={handleChange}
                                                    />
                                                    <label htmlFor={`choice_${choice.id}`} className="ml-2">{choice.description}</label>
                                                </li>
                                            ))}
                                        </ul>
                                    </fieldset>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-gray-600">No questions available</p>
                        )}

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-red-800 text-white py-3 px-4 rounded-md hover:bg-red-600 mt-4"
                        >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </Layout>
    );
};

export default SubmitSaratFormQuestions;
