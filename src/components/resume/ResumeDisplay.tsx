import React, { useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from '../../../convex/_generated/api';
import { useAuth } from '../../lib/auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { FileText, Edit, Save, X, Plus, Trash2 } from 'lucide-react';

export function ResumeDisplay() {
  const { user } = useAuth();
  const masterResume = useQuery(api.resumes.getMasterResume, user ? { userId: user._id } : "skip");
  const [isEditing, setIsEditing] = useState(false);
  const [editedResume, setEditedResume] = useState(masterResume?.structured);

  React.useEffect(() => {
    if (masterResume) {
      setEditedResume(masterResume.structured);
    }
  }, [masterResume]);

  if (!masterResume) {
    return (
      <div className="text-center py-8">
        <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
        <p className="text-gray-600">No resume uploaded yet</p>
      </div>
    );
  }

  const handleSave = async () => {
    // TODO: Implement save functionality with mutation
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedResume(masterResume.structured);
    setIsEditing(false);
  };

  const addExperience = () => {
    if (editedResume) {
      setEditedResume({
        ...editedResume,
        experience: [
          ...editedResume.experience,
          { title: '', company: '', startDate: '', endDate: '', description: '' }
        ]
      });
    }
  };

  const removeExperience = (index: number) => {
    if (editedResume) {
      setEditedResume({
        ...editedResume,
        experience: editedResume.experience.filter((_, i) => i !== index)
      });
    }
  };

  const updateExperience = (index: number, field: string, value: string) => {
    if (editedResume) {
      const updated = [...editedResume.experience];
      updated[index] = { ...updated[index], [field]: value };
      setEditedResume({ ...editedResume, experience: updated });
    }
  };

  const addEducation = () => {
    if (editedResume) {
      setEditedResume({
        ...editedResume,
        education: [
          ...editedResume.education,
          { degree: '', institution: '', graduationDate: '', gpa: '' }
        ]
      });
    }
  };

  const removeEducation = (index: number) => {
    if (editedResume) {
      setEditedResume({
        ...editedResume,
        education: editedResume.education.filter((_, i) => i !== index)
      });
    }
  };

  const updateEducation = (index: number, field: string, value: string) => {
    if (editedResume) {
      const updated = [...editedResume.education];
      updated[index] = { ...updated[index], [field]: value };
      setEditedResume({ ...editedResume, education: updated });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          Master Resume
        </h2>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button onClick={handleSave} size="sm">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={handleCancel} variant="outline" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </div>

      {editedResume && (
        <div className="space-y-8">
          {/* Personal Information */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={editedResume.name || ''}
                  onChange={(e) => setEditedResume({ ...editedResume, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={editedResume.email || ''}
                  onChange={(e) => setEditedResume({ ...editedResume, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={editedResume.phone || ''}
                  onChange={(e) => setEditedResume({ ...editedResume, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </section>

          {/* Experience */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Experience</h3>
              {isEditing && (
                <Button onClick={addExperience} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {editedResume.experience.map((exp, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Job Title</Label>
                        <Input
                          value={exp.title}
                          onChange={(e) => updateExperience(index, 'title', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Company</Label>
                        <Input
                          value={exp.company}
                          onChange={(e) => updateExperience(index, 'company', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Start Date</Label>
                        <Input
                          value={exp.startDate || ''}
                          onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>End Date</Label>
                        <Input
                          value={exp.endDate || ''}
                          onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    {isEditing && (
                      <Button
                        onClick={() => removeExperience(index)}
                        size="sm"
                        variant="outline"
                        className="ml-4 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <div>
                    <Label>Description</Label>
                    <textarea
                      className="w-full p-2 border rounded-md"
                      rows={3}
                      value={exp.description || ''}
                      onChange={(e) => updateExperience(index, 'description', e.target.value)}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          <section>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Education</h3>
              {isEditing && (
                <Button onClick={addEducation} size="sm" variant="outline">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Education
                </Button>
              )}
            </div>
            <div className="space-y-4">
              {editedResume.education.map((edu, index) => (
                <div key={index} className="p-4 border rounded-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Degree</Label>
                        <Input
                          value={edu.degree}
                          onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Institution</Label>
                        <Input
                          value={edu.institution}
                          onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>Graduation Date</Label>
                        <Input
                          value={edu.graduationDate || ''}
                          onChange={(e) => updateEducation(index, 'graduationDate', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                      <div>
                        <Label>GPA</Label>
                        <Input
                          value={edu.gpa || ''}
                          onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                          disabled={!isEditing}
                        />
                      </div>
                    </div>
                    {isEditing && (
                      <Button
                        onClick={() => removeEducation(index)}
                        size="sm"
                        variant="outline"
                        className="ml-4 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Skills */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Skills</h3>
            <div>
              <Label>Skills (comma-separated)</Label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={3}
                value={editedResume.skills.join(', ')}
                onChange={(e) => setEditedResume({
                  ...editedResume,
                  skills: e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
                })}
                disabled={!isEditing}
              />
            </div>
          </section>

          {/* Certifications */}
          <section>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Certifications</h3>
            <div>
              <Label>Certifications (comma-separated)</Label>
              <textarea
                className="w-full p-2 border rounded-md"
                rows={2}
                value={editedResume.certifications.join(', ')}
                onChange={(e) => setEditedResume({
                  ...editedResume,
                  certifications: e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0)
                })}
                disabled={!isEditing}
              />
            </div>
          </section>
        </div>
      )}
    </div>
  );
}