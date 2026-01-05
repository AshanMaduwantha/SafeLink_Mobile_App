// classes.service.ts
import { Class, FormattedClass } from "@services/models";
import promotionsService from "../promotions";
import apiClient from "./api-client";

class ClassesService {
  private readonly endpoint = "/classes";

  //Get all classes
  async getAllClasses(): Promise<Class[]> {
    try {
      const response = await apiClient.get<{
        status: string;
        message: string;
        data: {
          classes: Class[];
          count: number;
        };
      }>(this.endpoint);

      return response.data.classes;
    } catch (error) {
      console.error("Error fetching classes:", error);
      throw new Error(
        "Couldn't load classes right now. Check your connection and try again",
      );
    }
  }

  //Format backend response for app UI
  formatClassesForUI(classes: Class[]): FormattedClass[] {
    return classes.map((c) => {
      const priceInfo = promotionsService.getDisplayPrice(c);

      return {
        id: c.id,
        title: c.class_name,
        instructor: c.course_instructor,
        price: priceInfo.displayPrice,
        rating: c.rating,
        image: c.image_url || "https://via.placeholder.com/300x200",
        video: c.video_url,
        description: c.class_description,
        isActive: c.is_active,
        promotion: c.promotion,
        discountedPrice: c.discounted_price,
        originalPrice: c.original_price,
        discountPercentage: c.discount_percentage,
        isDiscounted: c.is_discounted,
        schedule: c.schedule,
      };
    });
  }

  // Filter only active classes
  filterActiveClasses(classes: Class[]): Class[] {
    return classes.filter((classItem) => classItem.is_active);
  }

  //Get memberships for a class
  async getClassMemberships(classId: string): Promise<
    Array<{
      id: string;
      membership_name: string;
      price_per_month: string | null;
      is_membership_enabled: boolean;
      status: string;
    }>
  > {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: {
        memberships: Array<{
          id: string;
          membership_name: string;
          price_per_month: string | null;
          is_membership_enabled: boolean;
          status: string;
        }>;
        count: number;
      };
    }>(`${this.endpoint}/${classId}/memberships`);
    return response.data.memberships;
  }

  //Get class access information for a user's membership
  async getClassAccess(classId: string): Promise<{
    hasMembership: boolean;
    userMembershipId: string | null;
    included: boolean;
    eligibleMemberships: Array<{
      id: string;
      membership_name: string;
      price_per_month: string | null;
      is_membership_enabled: boolean;
      status: string;
    }>;
  }> {
    const response = await apiClient.get<{
      status: string;
      message: string;
      data: {
        hasMembership: boolean;
        userMembershipId: string | null;
        included: boolean;
        eligibleMemberships: Array<{
          id: string;
          membership_name: string;
          price_per_month: string | null;
          is_membership_enabled: boolean;
          status: string;
        }>;
      };
    }>(`${this.endpoint}/${classId}/membership-access`);
    return response.data;
  }
}

export default new ClassesService();
