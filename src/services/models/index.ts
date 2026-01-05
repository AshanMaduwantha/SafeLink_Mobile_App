export interface ICardItem {
  name: string;
  description: string;
  language: string;
  star: number;
  fork: number;
}

export interface ScheduleItem {
  date: string;
  name: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  schedule_id: string;
}

// Class types
export interface Class {
  id: string;
  class_name: string;
  class_description: string;
  class_price: number;
  is_active: boolean;
  image_url: string | null;
  video_url: string | null;
  course_instructor: string;
  rating: number | null;
  created_at: string;
  promotion_id?: string | null;
  promotion?: Promotion | null;
  discounted_price?: number | null;
  original_price?: number | null;
  discount_percentage?: number | null;
  is_discounted?: boolean;
  schedule: ScheduleItem[];
}

export interface FormattedClass {
  id: string;
  title: string;
  instructor: string;
  price: number;
  rating: number | null;
  image: string;
  video: string | null;
  description: string;
  isActive: boolean;
  enrolledStudents: number;
  date: string;
  promotion?: Promotion | null;
  discountedPrice?: number | null;
  originalPrice?: number | null;
  discountPercentage?: number | null;
  isDiscounted?: boolean;
  schedule: ScheduleItem[];
}

// Promotion types
export interface Promotion {
  id: string;
  promotion_name: string;
  discount: number;
  start_date: string;
  end_date: string;
  status: string;
  is_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// Enrollment types
export interface Enrollment {
  schedule: never[];
  id: string;
  user_id: string;
  class_id: string;
  user_name: string;
  user_email: string;
  user_phone: string | null;
  status: "active" | "cancelled" | "completed";
  enrolled_at: string;
  created_at: string;
  updated_at: string;
  payment_type?: "membership" | "drop_in" | "class_pack" | null;
  class_name?: string;
  class_description?: string;
  image_url?: string | null;
  video_url?: string | null;
  course_instructor?: string;
  rating?: number | null;
}

export interface CreateEnrollmentDto {
  class_id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
}

export interface LatestNews {
  id: string;
  title: string;
  content: string;
  image_url: string | null;
  author: string;
  publish_date: string;
  status: string;
  category: string;
  is_pinned: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormattedLatestNews {
  id: string;
  title: string;
  content: string;
  image: string;
  author: string;
  publishDate: string;
  category: string;
  isPinned: boolean;
  status: string;
}

// Membership types
export interface Membership {
  id: string;
  membership_name: string;
  price_per_month: string;
  membership_price: number;
  status: "Active" | "Inactive";
  is_membership_enabled: boolean;
  created_at: string;
  updated_at: string;
}

export interface FormattedMembership {
  id: string;
  name: string;
  price: number | null;
  isActive: boolean;
}

export interface CheckIn {
  id: string;
  enrollment_id: string;
  class_id: string;
  user_id: string;
  checkin_status: boolean;
  schedule_id: string;
  created_at: string;
}
export interface EnrolledStudent {
  id: string | null;
  name: string;
  avatar: string | null;
  enrollment_id: string;
  db_user_id: string;
}
