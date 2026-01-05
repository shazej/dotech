import 'package:dotech_provider/features/jobs/domain/entities/job.dart';

class JobModel extends Job {
  const JobModel({
    required super.id,
    required super.userId,
    required super.serviceId,
    required super.scheduledAt,
    required super.status,
    required super.addressId,
    super.customerPhone,
  });

  factory JobModel.fromJson(Map<String, dynamic> json) {
    return JobModel(
      id: json['id'] ?? '',
      userId: json['userId'] ?? '',
      serviceId: json['serviceId'] ?? '',
      scheduledAt: DateTime.parse(json['scheduledAt']),
      status: json['status'] ?? 'requested',
      addressId: json['addressId'] ?? '',
      customerPhone: json['customerPhone'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'userId': userId,
      'serviceId': serviceId,
      'scheduledAt': scheduledAt.toIso8601String(),
      'status': status,
      'addressId': addressId,
      'customerPhone': customerPhone,
    };
  }
}
