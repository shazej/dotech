import 'package:dotech_provider/features/onboarding/domain/entities/provider_profile.dart';

class ProviderProfileModel extends ProviderProfile {
  const ProviderProfileModel({
    required super.id,
    required super.userId,
    super.bio,
    required super.skills,
    required super.rating,
    required super.isVerified,
  });

  factory ProviderProfileModel.fromJson(Map<String, dynamic> json) {
    return ProviderProfileModel(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      bio: json['bio'],
      skills: List<String>.from(json['skills'] ?? []),
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      isVerified: json['isVerified'] ?? false,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'bio': bio,
      'skills': skills,
      'rating': rating,
      'isVerified': isVerified,
    };
  }
}
