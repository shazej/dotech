import 'package:equatable/equatable.dart';

class Booking extends Equatable {
  final String id;
  final String userId;
  final String? providerId;
  final String serviceId;
  final DateTime scheduledAt;
  final String status;
  final String addressId;

  const Booking({
    required this.id,
    required this.userId,
    this.providerId,
    required this.serviceId,
    required this.scheduledAt,
    required this.status,
    required this.addressId,
  });

  @override
  List<Object?> get props => [
    id,
    userId,
    providerId,
    serviceId,
    scheduledAt,
    status,
    addressId,
  ];
}
