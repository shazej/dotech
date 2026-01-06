import 'package:dotech_customer/features/booking/domain/entities/booking.dart';

class BookingModel extends Booking {
  const BookingModel({
    required super.id,
    required super.userId,
    super.providerId,
    required super.serviceId,
    required super.scheduledAt,
    required super.status,
    required super.addressId,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      providerId: json['providerId'],
      serviceId: json['serviceId'] ?? '',
      scheduledAt: DateTime.parse(json['scheduledAt']),
      status: json['status'] ?? 'requested',
      addressId: json['addressId'] ?? '',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'providerId': providerId,
      'serviceId': serviceId,
      'scheduledAt': scheduledAt.toIso8601String(),
      'status': status,
      'addressId': addressId,
    };
  }
}
