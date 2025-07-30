// Resume parsing utility using basic PDF text extraction
// This is a simplified parser that extracts text and attempts to structure it
// In a production app, you would use a more sophisticated parsing service

import * as pdfjsLib from 'pdfjs-dist';

// Set the worker source for PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ResumeStructured {
  name?: string;
  email?: string;
  phone?: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  skills: string[];
  certifications: string[];
}

interface ExperienceEntry {
  title: string;
  company: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface EducationEntry {
  degree: string;
  institution: string;
  graduationDate?: string;
  gpa?: string;
}

export async function parseResumePDF(file: File): Promise<{ parsedText: string; structured: ResumeStructured }> {
  try {
    // Convert file to array buffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Load PDF document
    const pdf = await pdfjsLib.getDocument(arrayBuffer).promise;
    
    let fullText = '';
    
    // Extract text from all pages
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const textContent = await page.getTextContent();
      const pageText = textContent.items
        .filter((item: any) => item.str)
        .map((item: any) => item.str)
        .join(' ');
      fullText += pageText + '\n';
    }

    // Parse the structured data from the extracted text
    const structured = parseStructuredData(fullText);

    return {
      parsedText: fullText,
      structured,
    };
  } catch (error) {
    console.error('PDF parsing error:', error);
    throw new Error('Failed to parse PDF resume. Please ensure the file is a valid PDF.');
  }
}

function parseStructuredData(text: string): ResumeStructured {
  const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  const structured: ResumeStructured = {
    experience: [],
    education: [],
    skills: [],
    certifications: [],
  };

  // Extract email
  const emailMatch = text.match(/[\w\.-]+@[\w\.-]+\.\w+/);
  if (emailMatch) {
    structured.email = emailMatch[0];
  }

  // Extract phone number
  const phoneMatch = text.match(/(?:\+?1[-.\s]?)?\(?[0-9]{3}\)?[-.\s]?[0-9]{3}[-.\s]?[0-9]{4}/);
  if (phoneMatch) {
    structured.phone = phoneMatch[0];
  }

  // Extract name (assume first line or first few words)
  const firstLine = lines[0];
  if (firstLine && !firstLine.includes('@') && firstLine.length < 50) {
    structured.name = firstLine;
  }

  // Extract skills (look for skills section)
  const skillsIndex = lines.findIndex(line => 
    /skills?|technologies?|technical/i.test(line) && line.length < 30
  );
  
  if (skillsIndex !== -1) {
    // Look for the next few lines after skills header
    for (let i = skillsIndex + 1; i < Math.min(skillsIndex + 5, lines.length); i++) {
      const line = lines[i];
      if (line && !isExperienceOrEducationLine(line)) {
        // Split skills by common separators
        const skillsInLine = line.split(/[,•·|]/).map(s => s.trim()).filter(s => s.length > 0);
        structured.skills.push(...skillsInLine);
      } else {
        break;
      }
    }
  }

  // Extract experience (simplified - look for company/title patterns)
  const experienceKeywords = /experience|work|employment|professional/i;
  const experienceIndex = lines.findIndex(line => experienceKeywords.test(line) && line.length < 30);
  
  if (experienceIndex !== -1) {
    for (let i = experienceIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      if (isEducationLine(line)) break;
      
      // Look for patterns that suggest job titles/companies
      if (line && line.length > 10 && line.length < 100) {
        // Simple heuristic: if line contains dates, it might be experience
        const dateMatch = line.match(/\d{4}|\d{1,2}\/\d{4}/);
        if (dateMatch || i < experienceIndex + 10) {
          structured.experience.push({
            title: line.split('|')[0] || line.split(',')[0] || line,
            company: line.split('|')[1] || line.split(',')[1] || 'Company Name',
            description: lines[i + 1] && lines[i + 1].length > 20 ? lines[i + 1] : undefined,
          });
        }
      }
    }
  }

  // Extract education
  const educationKeywords = /education|academic|university|college|degree/i;
  const educationIndex = lines.findIndex(line => educationKeywords.test(line) && line.length < 30);
  
  if (educationIndex !== -1) {
    for (let i = educationIndex + 1; i < Math.min(educationIndex + 10, lines.length); i++) {
      const line = lines[i];
      if (line && line.length > 10) {
        structured.education.push({
          degree: line,
          institution: lines[i + 1] || 'Institution Name',
        });
      }
    }
  }

  return structured;
}

function isExperienceOrEducationLine(line: string): boolean {
  return /experience|education|work|employment|university|college|degree/i.test(line);
}

function isEducationLine(line: string): boolean {
  return /education|academic|university|college|degree/i.test(line);
}