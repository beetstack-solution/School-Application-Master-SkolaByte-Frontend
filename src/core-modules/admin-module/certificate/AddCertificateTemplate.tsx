import { useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { IoCheckmarkDoneCircleOutline } from 'react-icons/io5';
import { FcCancel } from 'react-icons/fc';
import Breadcrumb from '@/components/Breadcumb';
import { TbArrowBackUp } from 'react-icons/tb';
import { createCertificateTemplate } from '@/api/admin-api/lookups-api/certificateApi';
import { getTemplateTypes } from '@/api/admin-api/lookups-api/templateTypeApi';
import { getPaperSizes } from '@/api/admin-api/lookups-api/paperSizeApi';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import DOMPurify from 'dompurify';
import { Modal } from 'react-bootstrap';

function AddCertificateTemplate() {
    const [formData, setFormData] = useState({
        name: '',
        templateType: '',
        paperSize: '',
        header: '',
        content: '',
        smartTag: '',
        footer: '',
        borderDesign: ''
    });
    const [showSourceModal, setShowSourceModal] = useState(false);
    const [currentSourceField, setCurrentSourceField] = useState<'header' | 'content' | 'footer'>('content');
    const [sourceCode, setSourceCode] = useState('');
    const [errors, setErrors] = useState<any>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [templateTypes, setTemplateTypes] = useState<any[]>([]);
    const [paperSizes, setPaperSizes] = useState<any[]>([]);
    const [previewHTML, setPreviewHTML] = useState('');
    const [isPreviewReady, setIsPreviewReady] = useState(false);
    const [draggedTag, setDraggedTag] = useState<string | null>(null);
    const navigate = useNavigate();

    const quillRefs = {
        header: useRef<ReactQuill>(null),
        content: useRef<ReactQuill>(null),
        footer: useRef<ReactQuill>(null)
    };

    const smartTags = [
        { label: 'School Name', value: 'school_name' },
        { label: 'Student Name', value: 'student_name' },
        { label: 'Course Name', value: 'course_name' },
        { label: 'Completion Date', value: 'completion_date' },
        { label: 'Certificate ID', value: 'certificate_id' },
        { label: 'Issue Date', value: 'issue_date' },
        { label: 'Director Name', value: 'director_name' },
        { label: 'Grade', value: 'grade' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [templateTypesRes, paperSizesRes] = await Promise.all([
                    getTemplateTypes(1, 100),
                    getPaperSizes(1, 100)
                ]);
                setTemplateTypes(templateTypesRes.data.data || []);
                setPaperSizes(paperSizesRes.data.data || []);
            } catch (error) {
                console.error('Error fetching data:', error);
                toast.error('Failed to load required data');
            }
        };
        fetchData();
    }, []);

    const handleDragStart = (e: React.DragEvent, tag: string) => {
        setDraggedTag(tag);
        e.dataTransfer.setData('text/plain', tag);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.currentTarget.classList.add('border-blue-400', 'bg-blue-50');
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');
    };

    const handleDrop = (e: React.DragEvent, field: 'header' | 'content' | 'footer') => {
        e.preventDefault();
        e.currentTarget.classList.remove('border-blue-400', 'bg-blue-50');

        const tag = e.dataTransfer.getData('text/plain');
        if (!tag) return;

        const quill = quillRefs[field].current?.getEditor();
        if (quill) {
            const range = quill.getSelection();
            if (range) {
                quill.insertText(range.index, tag);
            } else {
                quill.insertText(0, tag);
            }
            quill.focus();
        }
    };

    const validateForm = () => {
        const newErrors: any = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.templateType) newErrors.templateType = 'Template type is required';
        if (!formData.paperSize) newErrors.paperSize = 'Paper size is required';
        if (!formData.header.trim()) newErrors.header = 'Header content is required';
        if (!formData.content.trim()) newErrors.content = 'Certificate content is required';
        if (!formData.footer.trim()) newErrors.footer = 'Footer content is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;

        if (name === 'templateType') {
            const selectedType = templateTypes.find(type => type._id === value);
            setFormData(prev => ({ ...prev, [name]: selectedType?.name || '' }));
        } else if (name === 'paperSize') {
            const selectedSize = paperSizes.find(size => size._id === value);
            setFormData(prev => ({ ...prev, [name]: selectedSize?.name || '' }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors((prev: any) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    const handleRichTextChange = (html: string, field: 'header' | 'content' | 'footer') => {
        setFormData(prev => ({ ...prev, [field]: html }));
        if (errors[field]) {
            setErrors((prev: any) => {
                const newErrors = { ...prev };
                delete newErrors[field];
                return newErrors;
            });
        }
    };

    const handleEditSource = (field: 'header' | 'content' | 'footer') => {
        setCurrentSourceField(field);
        setSourceCode(formData[field]);
        setShowSourceModal(true);
    };

    const handleSaveSourceCode = () => {
        setFormData(prev => ({
            ...prev,
            [currentSourceField]: sourceCode
        }));
        setShowSourceModal(false);
    };

    const generatePreview = () => {
        let headerContent = formData.header || '<div style="color: #999;">[Header content will appear here]</div>';

        if (headerContent.includes('<img')) {
            headerContent = headerContent.replace(
                /<img([^>]*)>/g,
                `<img$1 style="width: 150px; height: 150px; border-radius: 50%; display: block; margin: 0 auto 20px auto; object-fit: cover; border: 2px solid #d4af37; box-shadow: 0 2px 5px rgba(0,0,0,0.2);" class="certificate-logo">`
            );
        }

        const html = `
        <div class="certificate-template" style="width: 100%; height: 100%; font-family: Arial, sans-serif;">
            ${formData.borderDesign ? formData.borderDesign.replace(
            /<!-- Certificate content -->/,
            `
                <div class="certificate-header" style="text-align: center; margin-bottom: 30px;">
                    ${headerContent}
                </div>
                <div class="certificate-content" style="text-align: center; margin: 20px 0; min-height: 300px;">
                    ${formData.content || '<div style="color: #999;">[Certificate content will appear here]</div>'}
                </div>
                <div class="certificate-footer" style="text-align: center; margin-top: 30px; font-size: 12px; color: #7f8c8d;">
                    ${formData.footer || '<div style="color: #999;">[Footer content will appear here]</div>'}
                </div>
                `
        ) : `
            <div class="certificate-header" style="text-align: center; margin-bottom: 30px;">
                ${headerContent}
            </div>
            <div class="certificate-content" style="text-align: center; margin: 20px 0; min-height: 300px;">
                ${formData.content || '<div style="color: #999;">[Certificate content will appear here]</div>'}
            </div>
            <div class="certificate-footer" style="text-align: center; margin-top: 30px; font-size: 12px; color: #7f8c8d;">
                ${formData.footer || '<div style="color: #999;">[Footer content will appear here]</div>'}
            </div>
            `}
        </div>
    `;

        setPreviewHTML(DOMPurify.sanitize(html));
        setIsPreviewReady(true);
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateForm()) {
            toast.error('Please fill all required fields correctly');
            return;
        }

        setIsSubmitting(true);
        try {
            const response: any = await createCertificateTemplate(formData);
            if (response.success) {
                toast.success('Certificate template added successfully!');
                navigate('/certificate-template');
            } else {
                toast.error(response.message || 'Failed to add certificate template');
            }
        } catch (error: any) {
            console.error('Error submitting certificate template:', error);
            toast.error(error.response?.data?.message || 'An error occurred while submitting');
        } finally {
            setIsSubmitting(false);
        }
    };

    const getError = (fieldName: string) => {
        return errors[fieldName] ? (
            <p className="mt-1 text-sm text-red-600">{errors[fieldName]}</p>
        ) : null;
    };

    const breadcrumbItems = [
        { label: "Home", path: "/" },
        { label: "Certificate Templates", path: "/certificate-template" },
        { label: "Add Template", path: "" },
    ];

    const modules = {
        toolbar: [
            [{ 'header': [1, 2, 3, false] }],
            ['bold', 'italic', 'underline'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['link', 'image'],
            ['clean']
        ]
    };

    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];

    return (
        <div className="mx-auto p-6 bg-gray-50 min-h-screen">
            <div className="mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h3 className="text-xl font-semibold mb-4">Add Certificate Template</h3>
                        <div className="breadcrumb-section">
                            <Breadcrumb items={breadcrumbItems} />
                        </div>
                    </div>
                    <div className="header-btns">
                        <button
                            type="button"
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                            onClick={() => navigate(-1)}
                        >
                            <TbArrowBackUp size={20} className="mr-2" />
                            Back
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-6">
                            <h2 className="text-lg font-medium text-gray-900">Template Details</h2>

                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Template Name *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                                {getError('name')}
                            </div>

                            <div>
                                <label htmlFor="templateType" className="block text-sm font-medium text-gray-700">
                                    Template Type *
                                </label>
                                <select
                                    id="templateType"
                                    name="templateType"
                                    value={templateTypes.find(type => type.name === formData.templateType)?._id || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select Template Type</option>
                                    {templateTypes.map((type) => (
                                        <option key={type._id} value={type._id}>
                                            {type.name}
                                        </option>
                                    ))}
                                </select>
                                {getError('templateType')}
                            </div>

                            <div>
                                <label htmlFor="paperSize" className="block text-sm font-medium text-gray-700">
                                    Paper Size *
                                </label>
                                <select
                                    id="paperSize"
                                    name="paperSize"
                                    value={paperSizes.find(size => size.name === formData.paperSize)?._id || ''}
                                    onChange={handleChange}
                                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                                >
                                    <option value="">Select Paper Size</option>
                                    {paperSizes.map((size) => (
                                        <option key={size._id} value={size._id}>
                                            {size.name}
                                        </option>
                                    ))}
                                </select>
                                {getError('paperSize')}
                            </div>

                            <div>
                                <label htmlFor="borderDesign" className="block text-sm font-medium text-gray-700">
                                    Border Design (HTML/CSS)
                                </label>
                                <textarea
                                    id="borderDesign"
                                    name="borderDesign"
                                    value={formData.borderDesign}
                                    onChange={handleChange}
                                    placeholder={`Example:\n<div class="gold-foil-border">\n  <div class="content">\n    <!-- Certificate content -->\n  </div>\n</div>\n\n<style>\n.gold-foil-border {\n  padding: 5px;\n  background: linear-gradient(135deg, #f5d76e 0%, #f7ca18 50%, #f5d76e 100%);\n  position: relative;\n  box-shadow: 0 5px 15px rgba(0,0,0,0.1);\n}\n\n.gold-foil-border .content {\n  background: white;\n  padding: 30px;\n  position: relative;\n}\n\n.gold-foil-border::before {\n  content: "";\n  position: absolute;\n  top: 15px; right: 15px; bottom: 15px; left: 15px;\n  border: 1px solid rgba(247, 202, 24, 0.3);\n  pointer-events: none;\n}\n</style>`}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm font-mono h-48"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Smart Tags - Drag and drop into editors below
                                </label>
                                <div className="flex flex-wrap gap-2 mb-4 p-4 bg-gray-100 rounded-lg">
                                    {smartTags.map((tag) => (
                                        <div
                                            key={tag.value}
                                            draggable
                                            onDragStart={(e) => handleDragStart(e, tag.value)}
                                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-md text-sm cursor-move hover:bg-blue-200 transition-colors"
                                        >
                                            {tag.label}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, 'header')}
                                className="transition-all duration-200"
                            >
                                <div className="flex justify-between items-center">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Header Content *
                                    </label>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => handleEditSource('header')}
                                            className="text-xs text-blue-600 hover:text-blue-800 mr-2"
                                        >
                                            Edit Source
                                        </button>
                                    </div>
                                </div>
                                <div className="border border-gray-300 rounded-md min-h-[160px] transition-all">
                                    <ReactQuill
                                        ref={quillRefs.header}
                                        theme="snow"
                                        value={formData.header}
                                        onChange={(value) => handleRichTextChange(value, 'header')}
                                        modules={modules}
                                        formats={formats}
                                        className="h-40 bg-white"
                                    />
                                </div>
                                {getError('header')}
                            </div>

                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, 'content')}
                                className="mb-6 transition-all duration-200"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Certificate Content *
                                    </label>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => handleEditSource('content')}
                                            className="text-xs text-blue-600 hover:text-blue-800 mr-2"
                                        >
                                            Edit Source
                                        </button>
                                    </div>
                                </div>
                                <div className="border border-gray-300 rounded-md min-h-[300px] transition-all">
                                    <ReactQuill
                                        ref={quillRefs.content}
                                        theme="snow"
                                        value={formData.content}
                                        onChange={(value) => handleRichTextChange(value, 'content')}
                                        modules={modules}
                                        formats={formats}
                                        className="h-64 bg-white"
                                    />
                                </div>
                                {getError('content')}
                            </div>

                            <div
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={(e) => handleDrop(e, 'footer')}
                                className="mb-6 transition-all duration-200"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Footer Content *
                                    </label>
                                    <div>
                                        <button
                                            type="button"
                                            onClick={() => handleEditSource('footer')}
                                            className="text-xs text-blue-600 hover:text-blue-800 mr-2"
                                        >
                                            Edit Source
                                        </button>
                                    </div>
                                </div>
                                <div className="border border-gray-300 rounded-md min-h-[120px] transition-all">
                                    <ReactQuill
                                        ref={quillRefs.footer}
                                        theme="snow"
                                        value={formData.footer}
                                        onChange={(value) => handleRichTextChange(value, 'footer')}
                                        modules={modules}
                                        formats={formats}
                                        className="h-32 bg-white"
                                    />
                                </div>
                                {getError('footer')}
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div className="flex justify-between items-center">
                                <h2 className="text-lg font-medium text-gray-900">Template Preview</h2>
                                <button
                                    type="button"
                                    onClick={generatePreview}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                                >
                                    Generate Preview
                                </button>
                            </div>

                            {isPreviewReady ? (
                                <div className="border-2 border-gray-200 p-4 rounded-lg">
                                    <div
                                        className="bg-white p-6 shadow-sm"
                                        style={{
                                            minHeight: '800px',
                                            position: 'relative',
                                            overflow: 'auto'
                                        }}
                                    >
                                        <div dangerouslySetInnerHTML={{ __html: previewHTML }} />
                                    </div>
                                </div>
                            ) : (
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                    <p className="text-gray-500 italic">
                                        Click "Generate Preview" to see how your certificate will look
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6 mt-6 border-t border-gray-200">
                        <button
                            type="button"
                            onClick={() => navigate('/certificate-template')}
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <FcCancel size={18} className="mr-2" />
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                <>
                                    <IoCheckmarkDoneCircleOutline size={18} className="mr-2" />
                                    Create Template
                                </>
                            )}
                        </button>
                    </div>
                </form>

                <Modal show={showSourceModal} onHide={() => setShowSourceModal(false)} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Edit HTML Source</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <textarea
                            value={sourceCode}
                            onChange={(e) => setSourceCode(e.target.value)}
                            className="w-full h-96 p-2 font-mono text-sm border border-gray-300 rounded"
                        />
                    </Modal.Body>
                    <Modal.Footer>
                        <button
                            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                            onClick={() => setShowSourceModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                            onClick={handleSaveSourceCode}
                        >
                            Save Changes
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
}

export default AddCertificateTemplate;