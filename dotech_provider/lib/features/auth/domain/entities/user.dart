import 'package:equatable/equatable.dart';

class User extends Equatable {
  final String id;
  final String phone;
  final String? email;
  final String role;
  final bool isVerified;

  const User({
    required this.id,
    required this.phone,
    this.email,
    required this.role,
    required this.isVerified,
  });

  @override
  List<Object?> get props => [id, phone, email, role, isVerified];
}
