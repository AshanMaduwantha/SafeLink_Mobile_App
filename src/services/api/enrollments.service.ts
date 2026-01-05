import { CreateEnrollmentDto, Enrollment } from "@services/models";
import apiClient from "./api-client";

export interface EnrolledStudent {
  id: string | null;
  name: string;
  avatar: string | null;
  enrollment_id: string;
  db_user_id: string;
}

class EnrollmentsService {
  private readonly endpoint = "/enrollments";

  async createEnrollment(
    enrollmentData: CreateEnrollmentDto & {
      payment_type?: "stripe" | "membership" | "class_pack";
    },
  ): Promise<{
    enrollment: Enrollment;
    warnings?: { membershipNotIncluded?: boolean; eligibleMemberships?: any[] };
  }> {
    try {
      const response = await apiClient.post<{
        status: string;
        message: string;
        data: {
          enrollment: Enrollment;
          warnings?: {
            membershipNotIncluded?: boolean;
            eligibleMemberships?: any[];
          };
        };
      }>(this.endpoint, enrollmentData);

      return {
        enrollment: response.data.enrollment,
        warnings: response.data.warnings,
      };
    } catch (error: any) {
      if (error.message === "User is already enrolled in this class") {
        throw new Error("You are already enrolled in this class");
      }
      console.error("Error creating enrollment:", error);
      throw new Error("Failed to enroll in class. Please try again later.");
    }
  }

  async getUserEnrollments(): Promise<Enrollment[]> {
    try {
      const response = await apiClient.get<{
        status: string;
        message: string;
        data: {
          enrollments: Enrollment[];
          count: number;
        };
      }>(this.endpoint);

      return response.data.enrollments;
    } catch (error) {
      console.error("Error fetching enrollments:", error);
      throw new Error("Failed to fetch enrollments. Please try again later.");
    }
  }

  async checkEnrollment(classId: string): Promise<boolean> {
    try {
      const response = await apiClient.get<{
        status: string;
        message: string;
        data: {
          isEnrolled: boolean;
        };
      }>(`${this.endpoint}/check/${classId}`);

      return response.data.isEnrolled;
    } catch (error) {
      console.error("Error checking enrollment:", error);
      return false;
    }
  }

  async cancelEnrollment(enrollmentId: string): Promise<Enrollment> {
    try {
      const response = await apiClient.patch<{
        status: string;
        message: string;
        data: {
          enrollment: Enrollment;
        };
      }>(`${this.endpoint}/${enrollmentId}/cancel`);

      return response.data.enrollment;
    } catch (error) {
      console.error("Error cancelling enrollment:", error);
      throw new Error("Failed to cancel enrollment. Please try again later.");
    }
  }

  async getEnrolledStudentsForClass(
    classId: string,
  ): Promise<EnrolledStudent[]> {
    try {
      const response = await apiClient.get<{
        status: string;
        message: string;
        data: { students: EnrolledStudent[]; count: number };
      }>(`/enrollments/class/${classId}/students`);
      return response.data.students || [];
    } catch (error) {
      console.error("Error fetching enrolled students:", error);
      throw error;
    }
  }
}

export default new EnrollmentsService();
