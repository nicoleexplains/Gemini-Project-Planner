
import { GoogleGenAI, Type } from "@google/genai";
import { Project, Task, Status } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const generateTaskSuggestions = async (project: Project): Promise<Partial<Task>[]> => {
  const prompt = `
    Based on the following project, generate a list of 5 to 7 key tasks required for its completion.
    For each task, provide a concise name and a one-sentence description. 
    Do not suggest a task for "Deployment" or "Launch".
    Project Name: "${project.name}"
    Description: "${project.description}"
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              name: {
                type: Type.STRING,
                description: 'The concise name of the task.',
              },
              description: {
                type: Type.STRING,
                description: 'A one-sentence description of the task.',
              },
            },
            required: ['name', 'description'],
          },
        },
      },
    });

    const jsonText = response.text.trim();
    const suggestedTasks = JSON.parse(jsonText);

    // Add default values for fields not provided by the AI
    return suggestedTasks.map((task: {name: string; description: string}) => ({
      ...task,
      assignee: 'Unassigned',
      status: Status.ToDo,
      startDate: project.startDate,
      endDate: project.endDate
    }));

  } catch (error) {
    console.error("Error generating task suggestions:", error);
    throw new Error("Failed to get task suggestions from AI. Please try again.");
  }
};
