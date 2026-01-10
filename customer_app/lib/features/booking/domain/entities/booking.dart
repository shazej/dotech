import 'package:equatable/equatable.dart';

class Booking extends Equatable {
  final String id;
  final String userId;
  final String? providerId;
  final String serviceId;
  final DateTime scheduledAt;
  final String status;
  final String addressId;
  final String? serviceName;
  final double? price;
  final int? durationMinutes;

  const Booking({
    required this.id,
    required this.userId,
    this.providerId,
    required this.serviceId,
    required this.scheduledAt,
    required this.status,
    required this.addressId,
    this.serviceName,
    this.price,
    this.durationMinutes,
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
    serviceName,
    price,
    durationMinutes,
  ];
}
