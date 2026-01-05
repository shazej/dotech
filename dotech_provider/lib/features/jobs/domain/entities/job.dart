import 'package:equatable/equatable.dart';

class Job extends Equatable {
  final String id;
  final String userId;
  final String serviceId;
  final DateTime scheduledAt;
  final String status;
  final String addressId;
  final String? customerPhone; // Added for provider convenience

  const Job({
    required this.id,
    required this.userId,
    required this.serviceId,
    required this.scheduledAt,
    required this.status,
    required this.addressId,
    this.customerPhone,
  });

  @override
  List<Object?> get props => [
    id,
    userId,
    serviceId,
    scheduledAt,
    status,
    addressId,
    customerPhone,
  ];
}
