import 'package:equatable/equatable.dart';

class ProviderProfile extends Equatable {
  final String id;
  final String userId;
  final String? bio;
  final List<String> skills;
  final double rating;
  final bool isVerified;

  const ProviderProfile({
    required this.id,
    required this.userId,
    this.bio,
    required this.skills,
    required this.rating,
    required this.isVerified,
  });

  @override
  List<Object?> get props => [id, userId, bio, skills, rating, isVerified];
}
